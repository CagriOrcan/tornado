# Tornado Push Notifications Documentation

This document explains how to use the comprehensive push notification system implemented in the Tornado dating app.

## Overview

The notification system uses React Context to provide push notification functionality throughout the app. It includes:

- **Expo Push Notifications** for remote notifications
- **Local notifications** for in-app alerts
- **Badge management** for unread message counts
- **Automatic notification handling** for chat events
- **Notification preferences** for user customization

## Setup

### 1. Context Provider

The `NotificationProvider` is already wrapped around the entire app in `app/_layout.tsx`:

```tsx
<NotificationProvider>
  {/* Your app content */}
</NotificationProvider>
```

### 2. Database Migration

Run the SQL migration to add push token support:

```sql
-- Add push_token column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS push_token TEXT;

-- Add read_at column to messages for tracking read status
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
```

## Usage Examples

### Basic Hook Usage

```tsx
import { useNotifications } from '@/contexts/NotificationContext';

function MyComponent() {
  const { 
    expoPushToken, 
    notification,
    sendPushNotification,
    scheduleLocalNotification,
    setBadgeCount 
  } = useNotifications();

  // Check if push notifications are available
  if (expoPushToken) {
    console.log('Push notifications ready!');
  }
}
```

### Sending Push Notifications

```tsx
import { 
  useNotifications, 
  NotificationTypes, 
  createNotificationData,
  getNotificationTitle,
  getNotificationBody 
} from '@/contexts/NotificationContext';

function ChatScreen({ matchId }: { matchId: string }) {
  const { sendPushNotification } = useNotifications();

  const notifyNewMessage = async (recipientPushToken: string) => {
    await sendPushNotification(
      recipientPushToken,
      getNotificationTitle(NotificationTypes.NEW_MESSAGE),
      getNotificationBody(NotificationTypes.NEW_MESSAGE),
      createNotificationData(NotificationTypes.NEW_MESSAGE, {
        match_id: matchId,
        sender_id: user.id,
      })
    );
  };
}
```

### Local Notifications

```tsx
function TimerComponent() {
  const { scheduleLocalNotification } = useNotifications();

  const scheduleTimerWarning = async () => {
    await scheduleLocalNotification(
      '⏰ 30 Seconds Left!',
      'Time is running out! Decide if you want to reveal profiles.',
      { seconds: 90 } // Trigger after 90 seconds
    );
  };
}
```

### Badge Management

```tsx
import { useNotificationBadge } from '@/components/NotificationService';

function MessagesScreen() {
  const { updateBadgeCount } = useNotificationBadge();

  useEffect(() => {
    // Badge count is automatically updated based on unread messages
    updateBadgeCount();
  }, []);
}
```

### Automatic Notifications

The `NotificationService` component automatically handles notifications for:

```tsx
// Add to your main screen
import { NotificationService } from '@/components/NotificationService';

function HomeScreen() {
  return (
    <View>
      <NotificationService />
      {/* Your screen content */}
    </View>
  );
}
```

This automatically sends notifications for:
- New messages
- New matches
- Profile reveals
- Match status changes

## Notification Types

The system includes predefined notification types:

```tsx
export const NotificationTypes = {
  NEW_MESSAGE: 'new_message',
  NEW_MATCH: 'new_match', 
  MATCH_REVEALED: 'match_revealed',
  TIMER_WARNING: 'timer_warning',
  RE_ENGAGEMENT: 're_engagement',
} as const;
```

Each type has predefined titles and bodies that can be customized.

## Chat Integration

Use the chat notification hook for timer-based notifications:

```tsx
import { useChatNotifications } from '@/components/NotificationService';

function AnonymousChatScreen({ matchId }: { matchId: string }) {
  const { scheduleTimerWarning } = useChatNotifications(matchId);

  useEffect(() => {
    // Schedule warning at 30-second mark
    scheduleTimerWarning();
  }, []);
}
```

## Edge Function Integration

For server-side notifications, use the Supabase Edge Function:

```tsx
// Call from your app
const { data, error } = await supabase.functions.invoke('send-notification', {
  body: {
    recipientIds: ['user1', 'user2'],
    title: 'New Match!',
    body: 'Someone wants to chat with you!',
    type: 'new_match',
    data: { match_id: 'match123' }
  }
});
```

## Demo Screen

Visit the **Notifications** tab in the app to see a comprehensive demo of all notification features:

- Test different notification types
- Schedule local notifications
- Manage badge counts
- Simulate chat timer notifications
- Configure notification preferences

## Best Practices

1. **Check Token Availability**: Always check if `expoPushToken` exists before sending notifications
2. **Handle Permissions**: The system automatically requests permissions, but handle gracefully if denied
3. **Background State**: Notifications are automatically managed based on app state
4. **Error Handling**: Wrap notification calls in try-catch blocks
5. **User Preferences**: Respect user notification preferences (implement settings screen)

## Troubleshooting

### Push Token Not Available
- Ensure you're testing on a physical device
- Check if notifications permissions are granted
- Verify Expo project configuration

### Notifications Not Received
- Check if app is in background/closed state
- Verify push token is saved to database
- Check Expo Push API response for errors

### Badge Count Issues
- Ensure `read_at` column exists in messages table
- Badge count updates automatically when app becomes active
- Manually call `updateBadgeCount()` after message reads

## Configuration

### Notification Channels (Android)
The system automatically creates a default notification channel with:
- High importance
- Sound enabled
- Vibration pattern
- Custom light color (Tornado orange)

### iOS Permissions
Automatically requests permissions for:
- Alerts
- Sounds
- Badges

## Security Considerations

- Push tokens are automatically updated in the database
- User IDs are validated before sending notifications
- Notification data is sanitized before sending
- Database RLS policies protect user data

## Testing

Use the demo screen (`/tabs/notifications-demo`) to test all functionality:

1. **Status Check**: Verify push token is active
2. **Type Testing**: Test all notification types
3. **Local Notifications**: Schedule and receive local alerts
4. **Badge Management**: Test badge count updates
5. **Chat Timer**: Simulate chat timer notifications
6. **Preferences**: Test notification preference toggles