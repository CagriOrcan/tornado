# Project Brief: Tornado Dating App MVP

## 1. Objective
Build a cross-platform (iOS/Android) Minimum Viable Product (MVP) of the "Tornado" dating app. The goal is to create a functional app that demonstrates the core user flow: a 2-minute anonymous chat followed by a mutual identity reveal.

## 2. Core Technology Stack
- **Framework:** React Native Expo (Expo Managed Workflow)
- **Backend (BaaS):** Supabase
- **Navigation:** **Expo Router** (File-based routing)
- **UI & Styling:** **shadcn-rn** components styled with **Tailwind CSS (nativewind)**
- **State Management:** Zustand

## 3. Supabase Setup Instructions
Initialize a new Supabase project and perform the following setup:

### 3.1. Tables
1.  **`profiles`**
    - `id` (uuid, primary key, references `auth.users.id`)
    - `created_at` (timestamp with time zone)
    - `full_name` (text)
    - `birth_date` (date)
    - `city` (text)
    - `bio` (text)
    - `interests` (array of text, e.g., `{"sports", "music"}`)
    - `avatar_url` (text)
    - `is_searching` (boolean, default: false) - *Used for matching logic*

2.  **`matches`**
    - `id` (uuid, primary key)
    - `created_at` (timestamp with time zone)
    - `user1_id` (uuid, foreign key to `profiles`)
    - `user2_id` (uuid, foreign key to `profiles`)
    - `status` (enum: 'searching', 'active', 'reveal_pending', 'revealed', 'ended_by_user', 'ended_by_timer')
    - `user1_consent` (boolean, default: false)
    - `user2_consent` (boolean, default: false)

3.  **`messages`**
    - `id` (bigint, primary key)
    - `created_at` (timestamp with time zone)
    * `match_id` (uuid, foreign key to `matches`)
    * `sender_id` (uuid, foreign key to `profiles`)
    * `content` (text)

### 3.2. Real-time & Storage
- **Enable Real-time:** Activate real-time functionality for the `messages` table.
- **Storage:** Create a public bucket named `avatars` for user profile pictures.

### 3.3. Supabase Edge Functions
- **`find-match`**: This is the core matching function.
    - When called by a user, it sets their `profiles.is_searching` to `true`.
    - It then queries the `profiles` table for another user who also has `is_searching = true` (and meets basic criteria like gender preference).
    - If a match is found, it creates a new row in `matches` with `status: 'active'`, sets both users' `is_searching` to `false`, and returns the new `match_id`.
    - If no match is found after a timeout (e.g., 30 seconds), it sets the user's `is_searching` back to `false` and returns a 'not found' status.

### 3.4. Row Level Security (RLS) Policies
- **Enable RLS** for all tables.
- **Profiles:** Users can only `select` their own profile and `update` their own profile. Other authenticated users can `select` a limited set of public profile data.
- **Matches/Messages:** Users can only `select` or `insert` into `matches` and `messages` where their user ID is either `user1_id` or `user2_id` (or `sender_id` for messages).

## 4. Development Plan: Screens & Components

### Step 1: Authentication & Profile Setup Flow
- Create Login and Sign Up screens in the `(auth)` group.
- After sign-up, force-navigate the user to a multi-step profile setup flow to populate their `profiles` data (name, bio, photos, etc.) before they can access the main app.

### Step 2: Home Screen & Tab Navigation
- Build the `(tabs)` layout with the custom floating action button (FAB).
- The Home Screen (`/tabs/home`) will feature the large "Start Tornado" button. Tapping it should show a loading/searching indicator and call the `find-match` Edge Function.

### Step 3: Matching & Chat Logic
- When `find-match` returns a `match_id`, navigate the user to `(chat)/[match_id]`.
- The `(chat)/[match_id]` screen component will be the most complex piece of the app.
    - It subscribes to the `matches` table row for the current `match_id` to listen for real-time status changes (`active` -> `reveal_pending` -> `revealed`).
    - It also subscribes to the `messages` table for new messages.
    - **Conditional UI:** The component will render different UI states based on the `match.status`:
        - `status: 'active'`: Show the anonymous view with the 2-minute timer. The timer should be driven by the client but validated by the `created_at` timestamp of the match for fairness.
        - `status: 'reveal_pending'`: When the timer ends, show the `Dialog` pop-up for reveal confirmation.
        - `status: 'revealed'`: Show the revealed view with real user profiles.
        - `status: 'ended_*'`: Show a "Match Ended" message and a button to return home.

### Step 4: Anonymous Chat Screen (`/screens/AnonymousChatScreen.js`)
- Fetch the `match_id` from navigation props.
- Display masked names and generic avatars.
- Implement a 2-minute countdown timer.
- Use Supabase Realtime Subscription to listen for new messages in the `messages` table where `match_id` matches the current chat.
- When the timer hits 0, display a modal (pop-up) asking for reveal confirmation.

### Step 5: Reveal Logic
- When a user clicks "Yes, Reveal," call a Supabase function `submit-consent` with the `match_id`.
- This function updates the corresponding `userX_consent` field to `true`.
- A database trigger on the `matches` table should then check if both `user1_consent` and `user2_consent` are `true`. If so, it automatically updates the `status` to `'revealed'`.
- The client app, listening to the real-time status change, will then automatically transition to the revealed UI.

### Step 6: Post-Reveal Experience
- The Revealed Chat Screen should allow for unlimited messaging.
- The Matches List Screen (`/tabs/matches`) should fetch and display all matches with `status: 'revealed'`.

### Step 7: Push Notifications
- Integrate `expo-notifications`.
- Set up Supabase Edge Functions triggered by database webhooks.
- Create a function that triggers on a new `messages` insert to send a push notification to the recipient if they are not active in the app.

## 5. UI/UX & Design Specifications

#### 5.1. Color Palette & Typography
- **Primary:** `#FF8C42`
- **Secondary:** `#FFD3B5`
- **Gradient:** From `#FF8C42` to `#E85D04`
- **Font:** **Inter**

#### 5.2. Key Screens
- **Authentication:** Full-screen gradient background.
- **Bottom Tab Navigator:** Custom 3-item bar with a central, notched, circular FAB containing a Tornado icon. This FAB is the primary call to action.

#### 5.3. Animations & User Feedback
- Use `react-native-reanimated` for smooth layout transitions, especially during the "reveal" moment.
- Provide clear loading states (e.g., a spinning tornado icon while matching) and error states (using `Toast` for non-blocking errors).

## 6. Error Handling & Edge Cases
- **Connection Loss:** If the user's WebSocket connection drops mid-chat, attempt to reconnect for a short period. If unsuccessful, the other user should be notified that their partner has disconnected.
- **Function Failure:** All calls to Supabase Edge Functions must be wrapped in `try/catch` blocks to handle potential failures gracefully and show an appropriate error message to the user.
- **User Exits App:** Use the AppState API to detect if a user backgrounds or closes the app mid-chat. Update their match status to `'ended_by_user'` to inform the other participant.

## 7. Final Deliverable
A complete, runnable, and polished React Native Expo project that is well-structured, handles common edge cases, and fully implements all features and UI/UX specifications outlined in this document.


