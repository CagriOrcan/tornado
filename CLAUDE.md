# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tornado** is a React Native Expo dating app with "conversation first, profile second" concept - users have 2-minute anonymous chats before revealing identities through mutual consent.

## Development Commands

```bash
# Start development server
npm start

# Platform-specific development
npm run android    # Android emulator/device
npm run ios        # iOS simulator/device  
npm run web        # Web browser

# Code quality
npm run lint       # ESLint

# Reset project template
npm run reset-project
```

## Technology Stack

- **Framework**: React Native Expo (Managed Workflow)
- **Language**: TypeScript
- **Backend**: Supabase (authentication, database, realtime, edge functions)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: Tailwind CSS with NativeWind + shadcn-rn components
- **State Management**: Zustand
- **Notifications**: Expo Notifications

## Architecture

### File Structure
- `app/` - Screen components using Expo Router file-based routing
  - `(auth)/` - Authentication screens (login, signup, profile-setup)
  - `(tabs)/` - Main app tabs (index/home, matches, profile, explore)
  - `(chat)/[match_id].tsx` - Dynamic chat screen
- `components/` - Reusable UI components
- `lib/` - Supabase client configuration
- `store/` - Zustand state stores
- `hooks/` - Custom React hooks
- `supabase/` - Edge functions

### Database Schema (Supabase)
- **profiles**: User data with `is_searching` flag for matching
- **matches**: Match records with status (`active`, `reveal_pending`, `revealed`, etc.)
- **messages**: Real-time chat messages linked to matches

### Core App Flow
1. Authentication → Profile setup
2. Home screen "Start Tornado" button calls `find-match` edge function
3. Anonymous 2-minute chat with real-time messaging
4. Timer expires → Mutual reveal consent dialog
5. If both consent → Unlimited messaging with revealed profiles

### Key Components
- **Chat Screen**: Complex stateful component with multiple UI states based on match status
- **Real-time Subscriptions**: Supabase realtime for messages and match status changes
- **Edge Functions**: `find-match`, `submit-consent`, `notify-new-message`
- **Push Notifications**: Triggered by database webhooks

### State Management Patterns
- Zustand stores for global state (user session, current match, etc.)
- Real-time subscriptions for live data updates
- Local state for UI interactions and timers

## Development Notes

- Follow existing component patterns in `components/` directory
- Use shadcn-rn components with Tailwind CSS styling
- Implement proper error handling for Supabase operations
- Test real-time functionality across multiple devices/simulators
- Handle edge cases like connection loss and app backgrounding

## UI/UX & Design Specifications

#### Color Palette & Typography
- **Primary:** `#FF8C42`
- **Secondary:** `#FFD3B5`
- **Gradient:** From `#FF8C42` to `#E85D04`
- **Font:** **Inter**

#### Key Screens
- **Authentication:** Full-screen gradient background.
- **Bottom Tab Navigator:** Custom 3-item bar with a central, notched, circular FAB containing a Tornado icon. This FAB is the primary call to action.