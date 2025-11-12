# Notification System

This directory contains the notification system components for the Trainer Portal.

## Overview

The notification system provides real-time alerts for trainers when clients send messages. It includes:

- **Real-time message notifications** via Firebase Firestore
- **Toast notifications** for instant alerts
- **Notification bell** with badge counter in the topbar
- **Notification panel** for viewing all notifications
- **Sound alerts** (optional)
- **Browser push notifications** (Web Push API)
- **Mark as read** functionality

## Components

### NotificationBell
Displays a bell icon with an unread count badge in the topbar. Clicking it opens the NotificationPanel.

**Location:** `src/components/notifications/NotificationBell.js`

### NotificationPanel
A dropdown panel that displays all notifications with:
- Sender name
- Message preview
- Timestamp
- Mark as read functionality
- Sound toggle
- Clear all option

**Location:** `src/components/notifications/NotificationPanel.js`

### ToastNotification
Shows toast notifications for the latest unread message. Automatically appears when a new message arrives.

**Location:** `src/components/notifications/ToastNotification.js`

## Services

### notificationService.js
Handles Firebase Firestore operations for notifications:
- `subscribeToAllTrainerMessages()` - Listen to messages from all clients
- `markNotificationAsRead()` - Mark a single notification as read
- `markConversationAsRead()` - Mark all notifications in a conversation as read
- `getTrainerNotifications()` - Fetch all notifications for a trainer

**Location:** `src/services/notificationService.js`

### pushNotificationService.js
Handles Web Push API functionality:
- `requestNotificationPermission()` - Request browser notification permission
- `showBrowserNotification()` - Display a browser notification
- `initializeServiceWorker()` - Register service worker for push notifications
- `subscribeToPushNotifications()` - Subscribe to push notifications (requires backend setup)

**Location:** `src/services/pushNotificationService.js`

## Context

### NotificationContext
Global state management for notifications. Provides:
- `notifications` - Array of all notifications
- `unreadCount` - Number of unread notifications
- `soundEnabled` - Sound alert toggle
- `pushEnabled` - Push notification status
- `markAsRead()` - Mark notification as read
- `markConversationRead()` - Mark conversation as read
- `markAllAsRead()` - Mark all notifications as read
- `clearAll()` - Clear all notifications

**Location:** `src/contexts/NotificationContext.js`

## Usage

### In Components

```javascript
import { useNotifications } from "../../contexts/NotificationContext";

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  // Use notifications...
}
```

### Integration

The notification system is automatically integrated into:
- **App.js** - NotificationProvider wraps the app
- **Topbar.js** - NotificationBell appears for trainers
- **Messages.js** - Automatically marks conversations as read when opened

## Firebase Structure

Notifications are stored in Firestore:

```
notifications/
  {notificationId}/
    - trainerId: string
    - clientId: string
    - clientName: string
    - messageText: string (preview)
    - fullMessage: string
    - timestamp: Timestamp
    - read: boolean
    - messageId: string
    - type: "message"
    - createdAt: Date
```

## Features

### Real-time Updates
Notifications are updated in real-time using Firebase Firestore `onSnapshot` listeners.

### Sound Alerts
Optional sound alerts play when new notifications arrive. Can be toggled in the notification panel.

### Browser Notifications
If permission is granted, browser notifications appear even when the app is in the background.

### Mark as Read
- Individual notifications can be marked as read
- Entire conversations are marked as read when the trainer opens the message view
- "Mark all as read" option available in the notification panel

## Configuration

### Environment Variables
For full push notification support, set:
```
REACT_APP_VAPID_PUBLIC_KEY=your_vapid_public_key
```

### Service Worker
The service worker (`public/service-worker.js`) handles:
- Push notification events
- Notification click events
- Offline caching

## Styling

The notification components use:
- Bootstrap for base styling
- Framer Motion for animations
- Custom gradients matching the portal theme
- Responsive design for mobile and desktop

## Browser Support

- **Chrome/Edge**: Full support (push notifications, service worker)
- **Firefox**: Full support
- **Safari**: Limited support (no push notifications on iOS)
- **Mobile browsers**: Varies by platform

## Future Enhancements

- FCM (Firebase Cloud Messaging) integration for cross-platform push
- Notification preferences/settings page
- Notification history/archive
- Group notifications by client
- Notification filters

