# ⚡ SkillSwap: A Web-Based Peer-to-Peer Platform for Collaborative Learning and Hobby Exchange

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white) ![Status](https://img.shields.io/badge/Status-Production%20Ready%20%E2%9C%85-10B981?style=for-the-badge)

> **Learn. Swap. Grow.** SkillSwap is a complete, working application that allows users to connect and trade skills. It connects individuals based on mutual learning interests, solving the "Double Coincidence of Wants" in peer-to-peer knowledge exchange.

---

## 🛠️ Tech Stack
This project uses a modern set of tools:
*   **Frontend:** Next.js (React), TypeScript, and Tailwind CSS.
*   **Backend:** Node.js with Express (`server.js`).
*   **Database:** Supabase (`schema.sql` and `supabase.ts`).
*   **Integrations:** Google API and Socket.io.

---

## 🎥 Video Preview

https://github.com/user-attachments/assets/519f2492-aae7-47cf-b912-d22fc894f111

---

## 📖 About the Project
Traditional Online Learning Platforms suffer from a high drop-out rate because learners feel isolated. SkillSwap fixes this by turning learning into a community exchange. 

You teach what you know, and in return, you learn what you need—no money required.

### ✨ Key Features
* **🔐 Passwordless Authentication:** Easy, secure login using a "Magic Link" via Gmail—no passwords needed.
* **🔍 Dynamic Skill Search:** A real-time search bar to instantly find peers by typing their name or skill.
* **🗂️ Category Filtering:** Filter the dashboard by departments like Development, Design, Languages, and Marketing.
* **🟢 Availability Toggle:** A simple switch to only show peers who are currently online.
* **📊 Match Sorting:** Organize your peer recommendations by "Recommended", "Top Rated," or "Newest."
* **💬 Stateful Real-Time Messaging:** Built-in chat using Socket.io, complete with typing indicators.
* **📁 Direct File Sharing:** Send images and documents safely inside the chat window.
* **🛡️ User Moderation Tools:** A safety menu to "Clear Chat", "Delete Conversation", "Block", or "Report".
* **📋 Skill Profile Builder:** An easy-to-use menu to check off the skills you want to teach and learn.
* **👤 Profile Management:** Update your Display Name, Title, Experience Level, Country, and Bio at any time.
* **🔒 Privacy Settings:** Toggles to turn on "Email Notifications" or hide your "Online Status".

---

## 📂 Folder Structure

The project is split into two main parts: `/backend` for the server logic and `/frontend` for the user interface.

```text
/ (Project Root)
├── backend/                       # Server files and logic
│   ├── .env                       # Backend keys and variables
│   ├── package.json               # Backend dependencies
│   ├── server.js                  # Main server code
│   └── temp_emails.log            # Log file for testing emails
├── frontend/                      # User interface and design
│   ├── public/                    # Images and static files
│   ├── src/                       # Main source code folder
│   │   ├── app/                   # Next.js pages and layouts
│   │   │   ├── team/          
│   │   │   │   └── page.tsx       # "Meet the Builders" team page
│   │   │   ├── globals.css        # Global design styles
│   │   │   ├── layout.tsx         # Main layout wrapper
│   │   │   └── page.tsx           # Main entry page (Landing/Dashboard)
│   │   ├── components/            # Reusable UI building blocks
│   │   │   ├── dashboard/         # Views for logged-in users (profile, admin, inbox)
│   │   │   ├── landing/           # Public pages (hero, how it works)
│   │   │   ├── layout/            # Headers and Footers
│   │   │   ├── onboarding/        # First-time user setup steps
│   │   │   └── shared/            # Shared features (chat, loaders, pop-ups)
│   │   ├── constants/         
│   │   │   └── data.ts            # Mock data for testing
│   │   ├── hooks/             
│   │   │   └── useSkillSwap.ts    # Core state manager
│   │   ├── lib/                   # Database clients and helper scripts (Supabase)
│   │   └── types/                 # TypeScript rules and definitions
│   ├── .env.local                 # Frontend keys and variables
│   └── package.json               # Frontend dependencies
├── .gitignore                     # Files to hide from GitHub
├── icon.png                       # Main app icon
├── schema.sql                     # Script to build the database tables
└── schema.txt                     # Text copy of database schema
```
## 🚀 Installation Instructions (How to Run)

Follow these simple steps to get the full project running on your computer.

### Step 1: Set up the Database
1. Open your **Supabase** dashboard.
2. Find the `schema.sql` file in the main folder.
3. Copy the code inside `schema.sql` and run it in your Supabase SQL editor to create your tables.

### Step 2: Set up the Backend
1. Open your terminal.
2. Move into the backend folder:
   ```bash
   cd backend
   ```
3. Install the required packages:
   ```bash
   npm install
   ```
4. Create a `.env` file in the backend folder and add your environment variables (like your Google API keys).
5. Start the server:
   ```bash
   npm start
   ```

### Step 3: Set up the Frontend
1. Open a new terminal window.
2. Move into the frontend folder:
   ```bash
   cd frontend
   ```
3. Install the required packages:
   ```bash
   npm install
   ```
4. Create a `.env.local` file in the frontend folder and add your frontend keys (like your Supabase URL).
5. Start the frontend website:
   ```bash
   npm run dev
   ```

### Step 4: View the App
Open your web browser and go to http://localhost:3000. You should now see the SkillSwap website running! 🎉

## 🛠️ System Architecture (Backend Integration)

> **Note:** These are the steps our team took to transition the app from a mock frontend to a full production build.

### 1. Database Setup & RLS (Supabase / PostgreSQL)
* **Transition:** Moved from mock `data.ts` to a live relational database.
* **Users Table:** `id`, `email`, `name`, `title`, `bio`, `location`, `rating`, `status`.
* **Skills Table:** Standardized list of skills (e.g., Python, Figma).
* **User_Skills (Bridge Table):** Maps `user_id` to `skill_id` with a type indicator.
* **Settings/Privacy:** Handled the `showOnlineStatus` and `emailNotifications` states.
* **Security:** Implemented Row Level Security (RLS) in Supabase to ensure users can only edit their own profiles and read their own chats.

### 2. Authentication & Email Delivery (Gmail SMTP Setup)
* **Login Flow:** Implemented a Passwordless Identity Verification (Magic Link) flow.
* **Configure Supabase Auth:** Configured Supabase to use a custom SMTP server (Gmail) to bypass default rate limits.
* **Setup Nodemailer:** Set up Nodemailer on the backend using Gmail SMTP credentials to send system emails based on socket events.

### 3. The Matchmaking Algorithm (Node.js API)
Moved scoring from the frontend to the backend.
* **Direct Matching (2-way):** Query the database to find User A (wants Python, teaches Figma) and User B (wants Figma, teaches Python).
* **Graph Theory / Circular Match (3-way):** Directed Graph algorithm in Node.js to find learning loops between three people.

### 4. Real-Time Chat & File Transfers (Socket.io)
Connected the `messenger.tsx` component to a real WebSocket server.
* **Presence Data:** Connecting or disconnecting automatically updates the Supabase status to Online or Offline.
* **Chat Rooms:** Generates a unique `room_id` for user matches.
* **Message & File Persistence:** Messages and Base64 files are broadcasted via Socket.io AND saved directly to a Supabase Messages table.

### 5. Final Integration Steps Completed
* Removed old `localStorage` logic from `useSkillSwap.ts`.
* Replaced local state with `useEffect` fetch calls to Supabase/Node.js endpoints.
* Connected the auth flow to Supabase's `supabase.auth.signInWithOtp({ email })`.
* Replaced the mock `apiStubs.sendMessageToSocket` with an actual `socket.emit('send_message', data)`.
