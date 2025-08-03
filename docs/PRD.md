# **Product Requirements Document (PRD): Tornado Dating App**

Document Version: 1.1 (Technical Stack Update)  
Date: August 3, 2025

### **1. Introduction and Purpose**

Tornado is a personality-focused mobile dating app designed as an alternative to the superficiality of modern dating apps. It encourages users to connect before they judge by looks, inviting them into a 2-minute anonymous chat. Identities ("the curtain") are lifted only upon mutual consent.

#### 1.1. Project Summary
Tornado is a personality-focused mobile dating app designed as an alternative to the superficiality of modern dating apps. It encourages users to connect before they judge by looks, inviting them into a 2-minute anonymous chat. Identities ("the curtain") are lifted only upon mutual consent.

#### 1.2. The Problem
Current popular dating apps push users to judge others based on appearance within seconds. This creates a fatiguing and shallow experience, making it difficult to establish meaningful conversations and deeper connections.

#### 1.3. Our Solution
Tornado solves this problem with a "conversation first, profile second" philosophy. Our goal is to provide users with a fun and intriguing platform where they can showcase their wit, intelligence, and personality, leading to more genuine and meaningful connections.

### **2\. Target Audience**

* **Primary Audience:** Tech-savvy single individuals aged 20-35, living in urban areas, who are tired of superficial dating apps and seek more authentic connections.

### 3. User Stories

* As a user, I want to create a profile with my photos and interests, so that I can express myself when my identity is revealed.
* As a user, I want to start an anonymous chat based on basic filters, so that I can get to know someone without prejudice.
* As a user, I want to use "icebreaker questions" during the chat, so that I can avoid awkward silences.
* As a user, I want to approve a reveal after 2 minutes, so that I can take the conversation to the next level if I'm interested.
* As a user, I want to see my successful matches in a "My Matches" list and chat with them limitlessly, so that I don't lose the connection.
* As a user, I want to report and block inappropriate behavior, so that I can feel safe.

### **4\. Features & Functionality (MVP)**

* **User Profile & Onboarding:** Email/Social signup, Profile creation (6 photos, bio, interests).  
* **Matching & Chat Initiation:** "Start Tornado" button, matches based on gender preference.  
* **Anonymous Chat Screen:** 2-minute countdown timer, randomized avatars, masked names (e.g., "J\*\*\*\*"), Icebreaker Questions button, Report/Block feature.  
* **The Reveal:** Synchronized pop-up on timer end. Mutual "Yes" reveals identities with an animation. "No" ends the chat politely.  
* **Post-Match:** Revealed chats are saved to a "My Matches" list for unlimited messaging.

### 6. UI/UX Design Specifications

* **Color Palette:** A warm palette derived from the energetic orange tones of the logo (using `#FF8C42` as a primary).
* **Typography:** A clean, modern sans-serif font (**Inter**).
* **Authentication Screens:** A full-screen background with a warm orange gradient.
* **Bottom Tab Navigator:** A custom 3-item tab bar with a large, central, circular "Tornado" button that initiates the matching process.

### **6. Technical Requirements (v1.1)**

* **Platform:** Cross-platform for iOS and Android.  
* **Technology Stack:** **React Native Expo (Expo Managed Workflow)**  
* **Backend (BaaS):** **Supabase** (for Database, Authentication, Real-time, and Storage).
* **State Management:** **Zustand**. Chosen for its simplicity, minimal boilerplate, and excellent performance, making it ideal for the MVP.  
* **Push Notifications:** **Expo Push Notifications** service will be used to implement the notification strategy.  
  * **New Messages:** Send a notification when the user receives a message while the app is in the background or closed.  
  * **Re-engagement:** Send a notification to inactive users after a set period (e.g., 3 days) with a message like "New Tornados are waiting for you\!".

### **7. Success Metrics (KPIs)**

* **Activation Rate:** % of new users who complete their first anonymous chat.  
* **Successful Match Rate:** % of anonymous chats that result in a mutual reveal.  
* **Retention:** D1, D7, D30 retention rates.  
* **Daily Active Users (DAU).**

### **8. Out of Scope (For MVP)**

* Advanced profile filters (education, height, etc.).  
* Voice or video messaging.  
* **Full offline support.** Users will need an active internet connection to use the app and view their chats.  
* Premium subscription model.