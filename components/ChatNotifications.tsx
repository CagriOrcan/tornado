import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { 
  useNotifications, 
  NotificationTypes, 
  createNotificationData,
  getNotificationTitle,
  getNotificationBody 
} from '@/contexts/NotificationContext';
import { useChatNotifications } from '@/components/NotificationService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TornadoColors } from '@/constants/Colors';

interface ChatNotificationsProps {
  matchId: string;
  isTimerActive: boolean;
  timeRemaining: number;
}

/**
 * Demo component showing how to integrate notifications in chat screen
 */
export function ChatNotifications({ 
  matchId, 
  isTimerActive, 
  timeRemaining 
}: ChatNotificationsProps) {
  const { 
    expoPushToken, 
    scheduleLocalNotification,
    sendPushNotification,
    setBadgeCount 
  } = useNotifications();
  
  const { scheduleTimerWarning } = useChatNotifications(matchId);
  const [warningScheduled, setWarningScheduled] = useState(false);

  // Schedule timer warning when chat starts
  useEffect(() => {
    if (isTimerActive && !warningScheduled && timeRemaining > 90) {
      scheduleTimerWarning();
      setWarningScheduled(true);
    }
  }, [isTimerActive, timeRemaining, warningScheduled, scheduleTimerWarning]);

  // Demo functions to show notification capabilities
  const demoLocalNotification = async () => {
    await scheduleLocalNotification(
      'Test Notification',
      'This is a test local notification from Tornado!',
      { seconds: 2 }
    );
    Alert.alert('Success', 'Local notification scheduled for 2 seconds');
  };

  const demoPushNotification = async () => {
    if (!expoPushToken) {
      Alert.alert('Error', 'Push token not available');
      return;
    }

    await sendPushNotification(
      expoPushToken,
      getNotificationTitle(NotificationTypes.NEW_MESSAGE),
      getNotificationBody(NotificationTypes.NEW_MESSAGE),
      createNotificationData(NotificationTypes.NEW_MESSAGE, { match_id: matchId })
    );
    Alert.alert('Success', 'Push notification sent to yourself!');
  };

  const updateBadge = async () => {
    await setBadgeCount(5);
    Alert.alert('Success', 'Badge count set to 5');
  };

  const clearBadge = async () => {
    await setBadgeCount(0);
    Alert.alert('Success', 'Badge count cleared');
  };

  return (
    <Card variant="outlined" padding="lg" style={{ margin: 16 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: TornadoColors.gray[900],
        marginBottom: 16,
        textAlign: 'center',
      }}>
        🔔 Notification Demo
      </Text>

      <View style={{ gap: 12 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <Text style={{ fontSize: 12, color: TornadoColors.gray[600] }}>
            Push Token: {expoPushToken ? '✅ Active' : '❌ Not Available'}
          </Text>
        </View>

        <Button
          title="Test Local Notification"
          onPress={demoLocalNotification}
          variant="secondary"
          size="sm"
        />

        <Button
          title="Test Push Notification"
          onPress={demoPushNotification}
          variant="outline"
          size="sm"
          disabled={!expoPushToken}
        />

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button
            title="Set Badge (5)"
            onPress={updateBadge}
            variant="ghost"
            size="sm"
            style={{ flex: 1 }}
          />
          <Button
            title="Clear Badge"
            onPress={clearBadge}
            variant="ghost"
            size="sm"
            style={{ flex: 1 }}
          />
        </View>

        {isTimerActive && (
          <View style={{
            backgroundColor: TornadoColors.secondary,
            padding: 12,
            borderRadius: 8,
            marginTop: 8,
          }}>
            <Text style={{
              fontSize: 14,
              color: TornadoColors.primary,
              textAlign: 'center',
              fontWeight: '600',
            }}>
              ⏰ Timer Active: {Math.floor(timeRemaining)}s remaining
            </Text>
            <Text style={{
              fontSize: 12,
              color: TornadoColors.gray[600],
              textAlign: 'center',
              marginTop: 4,
            }}>
              Warning notification scheduled for 30s mark
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

/**
 * Notification preferences component
 */
export function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    newMessages: true,
    newMatches: true,
    reveals: true,
    reEngagement: true,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Card variant="elevated" padding="lg">
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: TornadoColors.gray[900],
        marginBottom: 16,
      }}>
        Notification Preferences
      </Text>

      <View style={{ gap: 16 }}>
        {Object.entries(preferences).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            onPress={() => togglePreference(key as keyof typeof preferences)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 8,
            }}
          >
            <Text style={{
              fontSize: 16,
              color: TornadoColors.gray[700],
              textTransform: 'capitalize',
            }}>
              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </Text>
            <View style={{
              width: 50,
              height: 28,
              borderRadius: 14,
              backgroundColor: value ? TornadoColors.primary : TornadoColors.gray[300],
              justifyContent: 'center',
              paddingHorizontal: 2,
            }}>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: TornadoColors.white,
                alignSelf: value ? 'flex-end' : 'flex-start',
              }} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
}