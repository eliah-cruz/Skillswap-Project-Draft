# ⚡ SkillSwap: A Web-Based Peer-to-Peer Skill Exchange Platform with Real-Time Communication

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

> **Learn. Swap. Grow.** SkillSwap is a state-aware discovery platform that connects individuals based on mutual learning interests, solving the "Double Coincidence of Wants" in peer-to-peer knowledge exchange.

---

## 🎥 Video Preview

https://github.com/user-attachments/assets/519f2492-aae7-47cf-b912-d22fc894f111

---

## 📖 About the Project
Traditional Online Learning Platforms (OLPs) suffer from up to a 90% attrition rate due to learner isolation and lack of accountability. SkillSwap transforms learning into a community-driven exchange. 

Built upon **Social Exchange Theory** and resolving the economic barrier of the **Double Coincidence of Wants**, SkillSwap uses a heuristic proximity matching algorithm to connect users. You teach what you know, and in return, you learn what you need—no currency required.

### ✨ Key Features
* **🔐 Passwordless Authentication:** Secure, frictionless login and account creation utilizing a "Magic Link" via Gmail SMTP—no passwords required.
* **🔍 Dynamic Skill Search:** Real-time search bar that allows users to instantly filter the dashboard to find specific peers by typing their names or desired skills.
* **🗂️ Category Filtering:** Dedicated tabs to filter the matchmaking dashboard by specific skill departments: All, Development, Design, Languages, and Marketing.
* **🟢 Availability Toggle:** A dedicated switch to filter the matchmaking dashboard to only show peers who are currently online and ready to interact.
* **📊 Match Sorting:** Organize peer recommendations dynamically by clicking sorting tabs such as "Recommended" (algorithmic matching), "Top Rated," or "Newest."
* **💬 Stateful Real-Time Messaging:** Built-in chat interface powered by Socket.io, featuring "Online" status indicators, typing indicators, and a persistent safety banner.
* **📁 Direct File Sharing:** Send images and documents directly within the chat interface using binary encoding, ensuring secure and temporary transfer without requiring cloud storage APIs.
* **🛡️ User Moderation Tools:** Built-in safety menu within active chats allowing users to "Clear Chat History," "Delete Conversation," "Block User," or "Report & Block."
* **📋 Skill Profile Builder:** An intuitive modal-based Skill Directory where users can easily browse categories and use checkboxes to add specific teachable and desired skills to their profile.
* **👤 Profile Management:** A dedicated form where users can update their personal metadata, including Display Name, Professional Title, Experience Level, Country, and Bio.
* **🔒 Privacy & Account Settings:** User-controlled settings featuring toggles for "Email Notifications" (for offline alerts) and "Show Online Status" to protect digital presence and privacy.

---

## 📂 Folder Structure

The project follows a clean feature-based architecture within the Next.js `app` router paradigm.

```text
src/
├── app/
│   ├── team/
│   │   └── page.tsx           # "Meet the Builders" team page
│   ├── favicon.ico
│   ├── globals.css            # Global Tailwind imports & custom animations
│   ├── layout.tsx             # Root layout wrapping the application
│   └── page.tsx               # Main entry point (Handles Auth, Landing, & Dashboard state)
├── components/
│   ├── dashboard/             # Logged-in user views
│   │   ├── dashboardhub.tsx   # Main matchmaking & filtering UI
│   │   ├── userprofile.tsx    # Edit profile details
│   │   └── usersettings.tsx   # Privacy and notification toggles
│   ├── landing/               # Public-facing views
│   │   ├── howitworks.tsx     # 3-step explanation UI
│   │   └── landinghero.tsx    # Hero section & Auth Forms
│   ├── layout/
│   │   ├── footer.tsx         # Global Footer
│   │   └── header.tsx         # Global Header & Navigation
│   ├── onboarding/
│   │   └── onboardingstep.tsx # First-time user skill selection
│   └── shared/                # Reusable UI components
│       ├── loader1.tsx        # Button spinner
│       ├── loader2.tsx        # Page loading animation
│       ├── messenger.tsx      # Slide-out real-time chat interface
│       ├── skilldirectory.tsx # Modal for adding new skills
│       └── toast.tsx          # Custom alert notifications
├── constants/
│   └── data.ts                # Mock data (Users, Matches, Categories)
├── hooks/
│   └── useSkillSwap.ts        # HUGE: Core state manager & mock backend logic
└── types/
    └── index.tsx              # Global TypeScript interfaces
```

---

## 🚀 How to Run Locally (Frontend)

Currently, the frontend runs completely in the browser using `localStorage` to simulate backend persistence via the `useSkillSwap` hook.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/eliah-cruz/Skillswap-Project-Draft
   cd skillswap
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser. 
   *(Note: You can use any dummy email to bypass the login screen since it currently uses a mock local-storage auth flow).*

---

## 🛠️ Backend Team Architecture & Roadmap
**ATTENTION BACKEND TEAM:** The frontend is currently mocked using `localStorage` inside `src/hooks/useSkillSwap.ts`. Your goal is to replace `apiStubs` and local storage logic with our actual stack: **Supabase (PostgreSQL), Node.js, Socket.io, Gmail SMTP, and Render.**

### 1. Database Setup & RLS (Supabase / PostgreSQL)
We need to transition from the mock `data.ts` to a relational database. 
* **Users Table:** `id`, `email`, `name`, `title`, `bio`, `location`, `rating`, `status (online/offline)`.
* **Skills Table:** Standardized list of skills (e.g., Python, Figma).
* **User_Skills (Bridge Table):** Maps `user_id` to `skill_id` with a type indicator (`type: 'teaching' | 'learning'`).
* **Settings/Privacy:** Tables/columns to handle the `showOnlineStatus` and `emailNotifications` states.
* **Security:** Implement **Row Level Security (RLS)** in Supabase to ensure users can only edit their own profiles and read chats they are a part of.

### 2. Authentication & Email Delivery (Gmail SMTP Setup)
As outlined in the system architecture, we are using a **Passwordless Identity Verification (Magic Link)** flow. The frontend has the "Get Magic Link" button ready in `landinghero.tsx` and an "Email Notifications" toggle in `usersettings.tsx`. 

**Backend Tasks for SMTP:**
1. **Configure Supabase Auth:** By default, Supabase email rate limits are low. You must configure Supabase to use a custom SMTP server (Gmail).
   * Create a dedicated Gmail account for the project (e.g., `skillswap.noreply@gmail.com`).
   * Generate an **App Password** in Google Account Security settings.
   * Go to Supabase Dashboard -> Authentication -> Providers -> Email -> Enable Custom SMTP and input the Gmail credentials.
2. **Setup Nodemailer (Node.js/Render):** Aside from auth, users can opt-in to receive emails when they get a new match or message. Set up Nodemailer on the Render backend using the same Gmail SMTP credentials to fire off system emails based on socket events.

### 3. The Matchmaking Algorithm (Node.js API)
Currently, `useSkillSwap.ts` uses a basic 2-way heuristic scoring system in the frontend. This needs to be moved to the backend.
* **Direct Matching (2-way):** Query the database to find User A (wants Python, teaches Figma) and User B (wants Figma, teaches Python).
* **Graph Theory / Circular Match (3-way):** Implement the logic mentioned in the PDF. Create a Directed Graph algorithm in Node.js to find loops: *User A teaches User B -> User B teaches User C -> User C teaches User A.*
* **Endpoint:** `GET /api/matches?userId=123&category=Design&onlineOnly=true`

### 4. Real-Time Chat & File Transfers (Socket.io hosted on Render)
The `messenger.tsx` component is ready to be hooked up to a real WebSocket server.
* **Setup:** Deploy a Node.js/Express server with Socket.io on **Render (PaaS)**.
* **Presence Data:** When a user connects to the socket, update their Supabase status to `Online`. Disconnect = `Offline` or `Away`. (Respecting their privacy toggle in `usersettings.tsx`).
* **Chat Rooms:** When two users match and chat, generate a unique `room_id`. 
* **Message & File Persistence:** When `sendMessageToSocket` is fired, the Node.js server must broadcast the text or Base64 file string via Socket.io AND save it to a Supabase `Messages` table simultaneously.
* **Safety Features:** Implement endpoints for the "Block User", "Report User", and "Delete Conversation" features found in the messenger dropdown.

### 5. Integration Steps for Frontend <-> Backend
Once the backend is live:
1. Strip out all `localStorage` logic inside `useSkillSwap.ts`.
2. Replace local state initialization with `useEffect` fetch calls to your Supabase/Node.js endpoints.
3. Hook up the auth flow to Supabase's `supabase.auth.signInWithOtp({ email })`.
4. Replace the `apiStubs.sendMessageToSocket` with actual `socket.emit('send_message', data)`.
