import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Platform, Alert, AppState, AppStateStatus } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  sendPushNotification: (expoPushToken: string, title: string, body: string, data?: any) => Promise<void>;
  registerForPushNotifications: () => Promise<string | null>;
  scheduleLocalNotification: (title: string, body: string, trigger?: Notifications.NotificationTriggerInput) => Promise<void>;
  dismissAllNotifications: () => Promise<void>;
  setBadgeCount: (count: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    registerForPushNotifications().then(token => setExpoPushToken(token));

    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('🔔 Notification received:', notification);
      setNotification(notification);
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      handleNotificationResponse(response);
    });

    // Handle app state changes for background notifications
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Clear badge when app becomes active
        setBadgeCount(0);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
      subscription?.remove();
    };
  }, []);

  // Update push token in Supabase when user changes
  useEffect(() => {
    if (user && expoPushToken) {
      updatePushTokenInDatabase(expoPushToken);
    }
  }, [user, expoPushToken]);

  const registerForPushNotifications = async (): Promise<string | null> => {
    let token = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF8C42',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Push notifications are needed to alert you when you receive messages and matches!'
        );
        return null;
      }
      
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
        if (!projectId) {
          throw new Error('Project ID not found');
        }
        
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
        console.log('✅ Push token obtained:', token);
      } catch (error) {
        console.error('❌ Error getting push token:', error);
        Alert.alert('Error', 'Failed to get push notification token');
      }
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }

    return token;
  };

  const updatePushTokenInDatabase = async (token: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ push_token: token })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating push token:', error);
      } else {
        console.log('✅ Push token updated in database');
      }
    } catch (error) {
      console.error('Error updating push token:', error);
    }
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data;
    
    // Handle different notification types
    switch (data?.type) {
      case 'new_message':
        if (data.match_id) {
          router.push(`/(chat)/${data.match_id}`);
        }
        break;
      case 'new_match':
        if (data.match_id) {
          router.push(`/(chat)/${data.match_id}`);
        }
        break;
      case 'match_revealed':
        if (data.match_id) {
          router.push(`/(chat)/${data.match_id}`);
        }
        break;
      case 're_engagement':
        router.push('/(tabs)/');
        break;
      default:
        // Default navigation
        router.push('/(tabs)/');
    }
  };

  const sendPushNotification = async (
    expoPushToken: string, 
    title: string, 
    body: string, 
    data?: any
  ) => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data: data || {},
      channelId: 'default',
    };

    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      console.log('✅ Push notification sent successfully');
    } catch (error) {
      console.error('❌ Error sending push notification:', error);
    }
  };

  const scheduleLocalNotification = async (
    title: string,
    body: string,
    trigger?: Notifications.NotificationTriggerInput
  ) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
          data: { local: true },
        },
        trigger: trigger || { seconds: 1 },
      });
      console.log('✅ Local notification scheduled');
    } catch (error) {
      console.error('❌ Error scheduling local notification:', error);
    }
  };

  const dismissAllNotifications = async () => {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('✅ All notifications dismissed');
    } catch (error) {
      console.error('❌ Error dismissing notifications:', error);
    }
  };

  const setBadgeCount = async (count: number) => {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('❌ Error setting badge count:', error);
    }
  };

  const value: NotificationContextType = {
    expoPushToken,
    notification,
    sendPushNotification,
    registerForPushNotifications,
    scheduleLocalNotification,
    dismissAllNotifications,
    setBadgeCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper functions for different notification types
export const NotificationTypes = {
  NEW_MESSAGE: 'new_message',
  NEW_MATCH: 'new_match',
  MATCH_REVEALED: 'match_revealed',
  TIMER_WARNING: 'timer_warning',
  RE_ENGAGEMENT: 're_engagement',
} as const;

export const createNotificationData = (type: string, additionalData?: any) => ({
  type,
  timestamp: new Date().toISOString(),
  ...additionalData,
});

export const getNotificationTitle = (type: string): string => {
  switch (type) {
    case NotificationTypes.NEW_MESSAGE:
      return '💬 New Message';
    case NotificationTypes.NEW_MATCH:
      return '🌪️ New Tornado Started!';
    case NotificationTypes.MATCH_REVEALED:
      return '✨ Profile Revealed!';
    case NotificationTypes.TIMER_WARNING:
      return '⏰ 30 Seconds Left!';
    case NotificationTypes.RE_ENGAGEMENT:
      return '🌪️ Ready for another Tornado?';
    default:
      return 'Tornado';
  }
};

export const getNotificationBody = (type: string, data?: any): string => {
  switch (type) {
    case NotificationTypes.NEW_MESSAGE:
      return 'You have a new message in your chat!';
    case NotificationTypes.NEW_MATCH:
      return 'Someone is ready to chat! Start your 2-minute conversation now.';
    case NotificationTypes.MATCH_REVEALED:
      return 'Your profiles have been revealed! Continue the conversation.';
    case NotificationTypes.TIMER_WARNING:
      return 'Time is running out! Decide if you want to reveal profiles.';
    case NotificationTypes.RE_ENGAGEMENT:
      return 'New people are waiting to connect. Start a Tornado now!';
    default:
      return 'You have a new notification from Tornado';
  }
};