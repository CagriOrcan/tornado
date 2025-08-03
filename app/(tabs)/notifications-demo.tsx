import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  useNotifications, 
  NotificationTypes, 
  createNotificationData,
  getNotificationTitle,
  getNotificationBody 
} from '@/contexts/NotificationContext';
import { useNotificationBadge } from '@/components/NotificationService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ChatNotifications, NotificationPreferences } from '@/components/ChatNotifications';
import { TornadoColors } from '@/constants/Colors';

export default function NotificationsDemoScreen() {
  const { 
    expoPushToken, 
    notification,
    sendPushNotification,
    scheduleLocalNotification,
    dismissAllNotifications,
    setBadgeCount,
  } = useNotifications();
  
  const { updateBadgeCount } = useNotificationBadge();
  const [demoTimerActive, setDemoTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120);

  // Demo timer for chat notifications
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (demoTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setDemoTimerActive(false);
      setTimeRemaining(120);
    }
    return () => clearInterval(interval);
  }, [demoTimerActive, timeRemaining]);

  const testNotificationType = async (type: keyof typeof NotificationTypes) => {
    if (!expoPushToken) {
      Alert.alert('Error', 'Push token not available');
      return;
    }

    const title = getNotificationTitle(NotificationTypes[type]);
    const body = getNotificationBody(NotificationTypes[type]);
    const data = createNotificationData(NotificationTypes[type], {
      match_id: 'demo-match-123',
      sender_id: 'demo-user-456',
    });

    try {
      await sendPushNotification(expoPushToken, title, body, data);
      Alert.alert('Success', `${type} notification sent!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const scheduleDelayedNotification = async () => {
    await scheduleLocalNotification(
      '🌪️ Scheduled Tornado',
      'This notification was scheduled 10 seconds ago!',
      { seconds: 10 }
    );
    Alert.alert('Scheduled', 'Notification will appear in 10 seconds');
  };

  const clearAllNotifications = async () => {
    await dismissAllNotifications();
    Alert.alert('Cleared', 'All notifications dismissed');
  };

  return (
    <LinearGradient
      colors={[TornadoColors.gradientStart, TornadoColors.gradientEnd]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ 
            padding: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Card variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: TornadoColors.gray[900],
              textAlign: 'center',
              marginBottom: 8,
            }}>
              🔔 Notifications Demo
            </Text>
            <Text style={{
              fontSize: 16,
              color: TornadoColors.gray[600],
              textAlign: 'center',
            }}>
              Test all notification features
            </Text>
          </Card>

          {/* Status Card */}
          <Card variant="outlined" padding="lg" style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: TornadoColors.gray[900],
              marginBottom: 12,
            }}>
              📊 Status
            </Text>
            
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: TornadoColors.gray[600] }}>Push Token:</Text>
                <Text style={{ 
                  color: expoPushToken ? TornadoColors.success : TornadoColors.error,
                  fontWeight: '600',
                }}>
                  {expoPushToken ? '✅ Active' : '❌ Not Available'}
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: TornadoColors.gray[600] }}>Last Notification:</Text>
                <Text style={{ color: TornadoColors.gray[700] }}>
                  {notification ? notification.request.content.title : 'None'}
                </Text>
              </View>
            </View>

            {expoPushToken && (
              <View style={{ 
                marginTop: 12, 
                padding: 8, 
                backgroundColor: TornadoColors.gray[100],
                borderRadius: 8,
              }}>
                <Text style={{ 
                  fontSize: 10, 
                  color: TornadoColors.gray[500],
                  fontFamily: 'monospace',
                }}>
                  Token: {expoPushToken.substring(0, 40)}...
                </Text>
              </View>
            )}
          </Card>

          {/* Notification Type Tests */}
          <Card variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: TornadoColors.gray[900],
              marginBottom: 16,
            }}>
              🧪 Test Notification Types
            </Text>

            <View style={{ gap: 12 }}>
              <Button
                title="💬 New Message"
                onPress={() => testNotificationType('NEW_MESSAGE')}
                variant="secondary"
                size="sm"
              />
              
              <Button
                title="🌪️ New Match"
                onPress={() => testNotificationType('NEW_MATCH')}
                variant="secondary"
                size="sm"
              />
              
              <Button
                title="✨ Match Revealed"
                onPress={() => testNotificationType('MATCH_REVEALED')}
                variant="secondary"
                size="sm"
              />
              
              <Button
                title="⏰ Timer Warning"
                onPress={() => testNotificationType('TIMER_WARNING')}
                variant="secondary"
                size="sm"
              />
              
              <Button
                title="🔄 Re-engagement"
                onPress={() => testNotificationType('RE_ENGAGEMENT')}
                variant="secondary"
                size="sm"
              />
            </View>
          </Card>

          {/* Local Notifications */}
          <Card variant="outlined" padding="lg" style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: TornadoColors.gray[900],
              marginBottom: 16,
            }}>
              📱 Local Notifications
            </Text>

            <View style={{ gap: 12 }}>
              <Button
                title="Schedule in 10 seconds"
                onPress={scheduleDelayedNotification}
                variant="outline"
                size="sm"
              />
              
              <Button
                title="Clear All Notifications"
                onPress={clearAllNotifications}
                variant="ghost"
                size="sm"
              />
            </View>
          </Card>

          {/* Badge Management */}
          <Card variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: TornadoColors.gray[900],
              marginBottom: 16,
            }}>
              🔴 Badge Management
            </Text>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button
                title="Set Badge (3)"
                onPress={() => setBadgeCount(3)}
                variant="secondary"
                size="sm"
                style={{ flex: 1 }}
              />
              <Button
                title="Set Badge (10)"
                onPress={() => setBadgeCount(10)}
                variant="secondary"
                size="sm"
                style={{ flex: 1 }}
              />
              <Button
                title="Clear Badge"
                onPress={() => setBadgeCount(0)}
                variant="outline"
                size="sm"
                style={{ flex: 1 }}
              />
            </View>
          </Card>

          {/* Chat Timer Demo */}
          <Card variant="outlined" padding="lg" style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: TornadoColors.gray[900],
              marginBottom: 16,
            }}>
              ⏱️ Chat Timer Demo
            </Text>

            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <Text style={{ color: TornadoColors.gray[700] }}>
                Demo Timer Active
              </Text>
              <Switch
                value={demoTimerActive}
                onValueChange={setDemoTimerActive}
                trackColor={{ 
                  false: TornadoColors.gray[300], 
                  true: TornadoColors.primary 
                }}
                thumbColor={TornadoColors.white}
              />
            </View>

            <ChatNotifications
              matchId="demo-match-123"
              isTimerActive={demoTimerActive}
              timeRemaining={timeRemaining}
            />
          </Card>

          {/* Notification Preferences */}
          <NotificationPreferences />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}