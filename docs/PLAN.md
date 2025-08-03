# Tornado MVP: Development Plan

**Document Version:** 1.0  
**Date:** August 3, 2025

This document outlines the detailed, step-by-step development plan for the Tornado Dating App MVP. The plan is divided into phases, each with specific tasks and objectives, to ensure a structured and trackable development lifecycle.

---

### **Phase 0: Project Foundation & Setup (1-2 Days)**

*Objective: Initialize the project, configure the development environment, and install all necessary dependencies.*

- [ ] **Task 0.1: Initialize Expo Project**
    - Create a new React Native Expo project with the "Tabs" template.
    - `npx create-expo-app@latest tornado --template tabs`
- [ ] **Task 0.2: Install Core Dependencies**
    - `npm install zustand`
    - `npm install @supabase/supabase-js`
- [ ] **Task 0.3: Setup Tailwind CSS (nativewind)**
    - `npm install nativewind`
    - `npm install --dev tailwindcss`
    - Initialize Tailwind: `npx tailwindcss init`
    - Configure `tailwind.config.js` to include content paths.
    - Add the Babel plugin to `babel.config.js`.
- [ ] **Task 0.4: Setup `shadcn-rn`**
    - `npx shadcn-rn@latest init`
    - Follow the CLI prompts to configure components, utils, and theme colors based on the PRD.
- [ ] **Task 0.5: Environment Variables**
    - Create a `.env` file to store Supabase URL and anon key.
    - Add `.env` to `.gitignore`.
    - Create a `lib/supabase.ts` file to initialize and export the Supabase client.
- [ ] **Task 0.6: Project Structure**
    - Verify and clean up the initial directory structure to match the project standard (e.g., `components`, `constants`, `hooks`, `app`).

---

### **Phase 1: Supabase Backend Setup (2-3 Days)**

*Objective: Configure the entire Supabase backend, including database schema, authentication, storage, and serverless functions.*

- [ ] **Task 1.1: Create Supabase Project**
    - Initialize a new project on the Supabase dashboard.
- [ ] **Task 1.2: Database Schema Setup**
    - Use the Supabase SQL editor to run scripts that create the `profiles`, `matches`, and `messages` tables as defined in `BRIEF.md`.
    - Set up primary keys, foreign key relationships, and default values.
- [ ] **Task 1.3: Implement Row Level Security (RLS)**
    - Enable RLS for all tables.
    - Write and apply the specific RLS policies for `profiles`, `matches`, and `messages` to ensure data privacy and security.
- [ ] **Task 1.4: Set Up Storage**
    - Create a new public storage bucket named `avatars`.
    - Define storage policies to restrict uploads and access as needed (e.g., users can only upload to their own folder).
- [ ] **Task 1.5: Develop Edge Functions**
    - **`find-match`**:
        - [ ] Create the function locally using the Supabase CLI.
        - [ ] Write the Deno function logic to find and create a match.
        - [ ] Test the function thoroughly using the CLI.
    - **`submit-consent`**:
        - [ ] Create the function locally.
        - [ ] Write the logic to update the user's consent status in the `matches` table.
    - **`notify-new-message`**:
        - [ ] Create the function to handle sending push notifications.
- [ ] **Task 1.6: Database Triggers & Real-time**
    - **Enable Real-time:** Activate real-time for the `messages` and `matches` tables.
    - **Create Trigger:** Set up a PostgreSQL trigger on the `matches` table that calls a function to check for mutual consent (`user1_consent` and `user2_consent`). If both are true, the function updates the match `status` to `'revealed'`.

---

### **Phase 2: Authentication & Profile Onboarding (3-4 Days)**

*Objective: Build the complete user authentication and profile creation flow.*

- [ ] **Task 2.1: Create Authentication Screens**
    - Develop the UI for Login and Sign Up screens within an `(auth)` route group.
    - Use `shadcn-rn` components (`Input`, `Button`, `Label`) and style with Tailwind CSS.
- [ ] **Task 2.2: Implement Auth Logic**
    - Integrate Supabase Auth for email/password and social sign-up.
    - Manage auth state using a Zustand store. The store will hold the user session and profile data.
    - Implement logic to redirect authenticated users away from auth screens.
- [ ] **Task 2.3: Build Profile Setup Flow**
    - Create a multi-step profile creation form (e.g., using a wizard or stacked screens).
    - **Step 1:** Full Name, Birth Date, City.
    - **Step 2:** Bio, Interests.
    - **Step 3:** Avatar Upload (connects to Supabase Storage).
- [ ] **Task 2.4: Profile Data Synchronization**
    - On sign-up, create a corresponding entry in the `profiles` table.
    - On completing the setup flow, `UPDATE` the user's row in the `profiles` table.
    - Ensure the user cannot access the main app until the profile setup is complete.

---

### **Phase 3: Core App Layout & Navigation (2-3 Days)**

*Objective: Set up the main application layout, including tab navigation and the central Floating Action Button (FAB).*

- [ ] **Task 3.1: Configure Expo Router (Tabs)**
    - Set up the `(tabs)` layout file (`_layout.tsx`).
    - Create placeholder files for the main screens: `(tabs)/index.tsx` (Home), `(tabs)/matches.tsx`, and `(tabs)/profile.tsx`.
- [ ] **Task 3.2: Build Custom Tab Bar with FAB**
    - Create a custom `TabBar` component.
    - Design the 3-item tab bar with a central, notched, circular FAB for initiating a match.
    - The FAB will be the primary "Start Tornado" button.
- [ ] **Task 3.3: Home Screen UI**
    - Implement the UI for the Home screen (`index.tsx`), featuring the prominent "Start Tornado" button/area.
- [ ] **Task 3.4: Matches & Profile Screen Placeholders**
    - Create basic UI for the "My Matches" and "Profile" screens. These will be fully developed in later phases.

---

### **Phase 4: Matching & Anonymous Chat (4-5 Days)**

*Objective: Implement the core functionality of finding a match and the anonymous chat experience.*

- [ ] **Task 4.1: "Start Tornado" Logic**
    - On FAB press, trigger a "searching" state in the UI (e.g., show a loading spinner/animation).
    - Call the `find-match` Supabase Edge Function.
    - Handle the response: on success (match found), navigate to the chat screen; on failure (timeout), show a "No one is around" message.
- [ ] **Task 4.2: Create Chat Screen**
    - Create a new file-based route `app/(chat)/[match_id].tsx`.
    - This screen will fetch the `match_id` from the route parameters.
- [ ] **Task 4.3: Implement Anonymous Chat UI**
    - Display masked names (e.g., "User A") and generic avatars.
    - Implement the 2-minute countdown timer.
    - Create the message input and message list view.
- [ ] **Task 4.4: Real-time Messaging**
    - Use Supabase Realtime to subscribe to the `messages` table for the current `match_id`.
    - Append new messages to the chat view as they arrive.
    - Implement the message sending logic, which inserts a new row into the `messages` table.
- [ ] **Task 4.5: Real-time Match Status**
    - Subscribe to the `matches` table for the current `match_id` to listen for status changes (`active`, `reveal_pending`, `revealed`, etc.).
    - The UI will conditionally render different components based on this status.

---

### **Phase 5: The Reveal Logic (2-3 Days)**

*Objective: Implement the synchronized identity reveal mechanism.*

- [ ] **Task 5.1: "Reveal Consent" UI**
    - When the 2-minute timer ends, update the match `status` to `reveal_pending`.
    - Show a `Dialog` (modal pop-up from `shadcn-rn`) to both users asking for reveal consent.
- [ ] **Task 5.2: Handle User Consent**
    - On "Yes, Reveal" press, call the `submit-consent` Edge Function.
    - On "No" press, update the match `status` to `ended_by_user`.
- [ ] **Task 5.3: Animate the Reveal**
    - When the real-time subscription detects the `status` has changed to `'revealed'`, trigger a UI transition.
    - Use `react-native-reanimated` to animate the reveal, smoothly replacing the anonymous avatars/names with the real profile data.

---

### **Phase 6: Post-Reveal Experience (2-3 Days)**

*Objective: Build out the screens for viewing past matches and continuing conversations.*

- [ ] **Task 6.1: Revealed Chat UI**
    - The `(chat)/[match_id]` screen should now show the real user profiles and allow for unlimited messaging.
- [ ] **Task 6.2: "My Matches" Screen**
    - Develop the `(tabs)/matches.tsx` screen.
    - Fetch and display a list of all matches where the `status` is `'revealed'`.
    - Each item in the list should show the other user's profile picture and name.
    - Tapping a match should navigate back to the `(chat)/[match_id]` screen.
- [ ] **Task 6.3: Profile Screen**
    - Develop the `(tabs)/profile.tsx` screen.
    - Allow users to view and edit their own profile information.
    - Include a "Logout" button.

---

### **Phase 7: Push Notifications (2-3 Days)**

*Objective: Integrate push notifications for better user engagement.*

- [ ] **Task 7.1: Configure Expo Push Notifications**
    - Install `expo-notifications`.
    - Implement the logic to get the user's push token and save it to their `profiles` table.
- [ ] **Task 7.2: Backend Notification Trigger**
    - Create a database webhook that calls the `notify-new-message` Edge Function whenever a new message is inserted.
- [ ] **Task 7.3: Client-Side Handling**
    - Implement logic to handle receiving and displaying notifications when the app is in the foreground, background, or closed.
    - Handle notification taps to navigate the user to the correct chat screen.

---

### **Phase 8: Polishing, Testing & Deployment Prep (3-4 Days)**

*Objective: Refine the UI/UX, handle edge cases, and prepare the app for release.*

- [ ] **Task 8.1: UI/UX Polishing**
    - Review all screens and add animations and smooth transitions with `react-native-reanimated`.
    - Ensure consistent use of the color palette and typography.
    - Implement clear loading states (e.g., skeletons, spinners) and error states (e.g., toasts).
- [ ] **Task 8.2: Error Handling & Edge Cases**
    - Implement robust `try/catch` blocks for all Supabase calls.
    - Use the `AppState` API to detect when a user backgrounds the app and update the match status accordingly.
    - Test for and handle network connection loss.
- [ ] **Task 8.3: Testing**
    - Conduct thorough manual testing of the end-to-end user flow.
    - (Optional) Write unit tests for critical utility functions and Zustand stores.
- [ ] **Task 8.4: Build & Deployment**
    - Create production builds for iOS and Android using EAS Build.
    - Submit the app to TestFlight and Google Play Console for internal testing.
    - Prepare store listings (screenshots, descriptions).
