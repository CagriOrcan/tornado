import React, { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useNotifications, NotificationTypes, createNotificationData } from '@/contexts/NotificationContext';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

/**
 * NotificationService component handles automatic notification sending
 * for various app events like new messages, matches, etc.
 */
export function NotificationService() {
  const { sendPushNotification, scheduleLocalNotification } = useNotifications();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          await handleNewMessage(payload.new);
        }
      )
      .subscribe();

    // Subscribe to new matches
    const matchesSubscription = supabase
      .channel('matches')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
        },
        async (payload) => {
          await handleNewMatch(payload.new);
        }
      )
      .subscribe();

    // Subscribe to match status updates (reveals)
    const matchUpdatesSubscription = supabase
      .channel('match_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
        },
        async (payload) => {
          await handleMatchUpdate(payload.new, payload.old);
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
      matchesSubscription.unsubscribe();
      matchUpdatesSubscription.unsubscribe();
    };
  }, [user]);

  const handleNewMessage = async (message: any) => {
    if (!user || message.sender_id === user.id) return;

    // Check if app is in background
    if (AppState.currentState !== 'active') {
      try {
        // Get the recipient's push token
        const { data: match } = await supabase
          .from('matches')
          .select(`
            *,
            user1_profile:profiles!matches_user1_id_fkey(push_token),
            user2_profile:profiles!matches_user2_id_fkey(push_token)
          `)
          .eq('id', message.match_id)
          .single();

        if (match) {
          const recipientProfile = match.user1_id === user.id 
            ? match.user2_profile 
            : match.user1_profile;

          if (recipientProfile?.push_token) {
            await sendPushNotification(
              recipientProfile.push_token,
              '💬 New Message',
              'You have a new message in your chat!',
              createNotificationData(NotificationTypes.NEW_MESSAGE, {
                match_id: message.match_id,
                sender_id: message.sender_id,
              })
            );
          }
        }
      } catch (error) {
        console.error('Error sending new message notification:', error);
      }
    }
  };

  const handleNewMatch = async (match: any) => {
    if (!user) return;

    try {
      // Get both users' push tokens
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, push_token, full_name')
        .in('id', [match.user1_id, match.user2_id]);

      if (profiles) {
        for (const profile of profiles) {
          if (profile.push_token && profile.id !== user.id) {
            await sendPushNotification(
              profile.push_token,
              '🌪️ New Tornado Started!',
              'Someone is ready to chat! Start your 2-minute conversation now.',
              createNotificationData(NotificationTypes.NEW_MATCH, {
                match_id: match.id,
              })
            );
          }
        }
      }
    } catch (error) {
      console.error('Error sending new match notification:', error);
    }
  };

  const handleMatchUpdate = async (newMatch: any, oldMatch: any) => {
    if (!user) return;

    // Check if match was revealed
    if (oldMatch.status !== 'revealed' && newMatch.status === 'revealed') {
      try {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, push_token, full_name')
          .in('id', [newMatch.user1_id, newMatch.user2_id]);

        if (profiles) {
          for (const profile of profiles) {
            if (profile.push_token) {
              await sendPushNotification(
                profile.push_token,
                '✨ Profile Revealed!',
                'Your profiles have been revealed! Continue the conversation.',
                createNotificationData(NotificationTypes.MATCH_REVEALED, {
                  match_id: newMatch.id,
                })
              );
            }
          }
        }
      } catch (error) {
        console.error('Error sending match revealed notification:', error);
      }
    }
  };

  // This component doesn't render anything
  return null;
}

/**
 * Hook for sending notifications in chat screens
 */
export function useChatNotifications(matchId: string) {
  const { scheduleLocalNotification } = useNotifications();

  const scheduleTimerWarning = async () => {
    await scheduleLocalNotification(
      '⏰ 30 Seconds Left!',
      'Time is running out! Decide if you want to reveal profiles.',
      { seconds: 90 } // 90 seconds after match starts (30 seconds before 2-minute timer ends)
    );
  };

  const sendReEngagementNotification = async (userPushToken: string) => {
    const { sendPushNotification } = useNotifications();
    
    await sendPushNotification(
      userPushToken,
      '🌪️ Ready for another Tornado?',
      'New people are waiting to connect. Start a Tornado now!',
      createNotificationData(NotificationTypes.RE_ENGAGEMENT)
    );
  };

  return {
    scheduleTimerWarning,
    sendReEngagementNotification,
  };
}

/**
 * Hook for managing app badge count
 */
export function useNotificationBadge() {
  const { setBadgeCount } = useNotifications();
  const { user } = useAuthStore();

  const updateBadgeCount = async () => {
    if (!user) return;

    try {
      // Count unread messages
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .neq('sender_id', user.id)
        .is('read_at', null);

      await setBadgeCount(count || 0);
    } catch (error) {
      console.error('Error updating badge count:', error);
    }
  };

  useEffect(() => {
    updateBadgeCount();

    // Update badge count when app becomes active
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        updateBadgeCount();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [user]);

  return { updateBadgeCount };
}