<div align="center">

<br/>

```
 ██╗     ██╗███████╗███████╗██╗   ██╗ █████╗ ██╗   ██╗██╗  ████████╗
 ██║     ██║██╔════╝██╔════╝██║   ██║██╔══██╗██║   ██║██║  ╚══██╔══╝
 ██║     ██║█████╗  █████╗  ██║   ██║███████║██║   ██║██║     ██║
 ██║     ██║██╔══╝  ██╔══╝  ╚██╗ ██╔╝██╔══██║██║   ██║██║     ██║
 ███████╗██║██║     ███████╗ ╚████╔╝ ██║  ██║╚██████╔╝███████╗██║
 ╚══════╝╚═╝╚═╝     ╚══════╝  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝
```

### **Digital Life Lessons Platform**

_Write it down. Share the wisdom. Never forget what life taught you._

<br/>

[![Live App](https://img.shields.io/badge/🌐_Live_App-life--vault--smoky.vercel.app-7C3AED?style=for-the-badge)](https://life-vault-smoky.vercel.app)
[![API](https://img.shields.io/badge/⚙️_API-life--vault--server.onrender.com-0F766E?style=for-the-badge)](https://life-vault-server.onrender.com)
[![Frontend](https://img.shields.io/badge/📦_Frontend-tanzid--48/life__vault-181717?style=for-the-badge&logo=github)](https://github.com/tanzid-48/life_vault)
[![Backend](https://img.shields.io/badge/🖥️_Backend-tanzid--48/life__vault__server-181717?style=for-the-badge&logo=github)](https://github.com/tanzid-48/life_vault_server)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Express.js-4-grey?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Stripe](https://img.shields.io/badge/Stripe-৳1500-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer](https://img.shields.io/badge/framer--motion-✅-FF0055?style=flat-square)](https://framer.com/motion)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 📌 Quick Links

|     | Resource          | URL                                                                                      |
| --- | ----------------- | ---------------------------------------------------------------------------------------- |
| 🌐  | **Live App**      | [life-vault-smoky.vercel.app](https://life-vault-smoky.vercel.app)                       |
| ⚙️  | **API Server**    | [life-vault-server.onrender.com](https://life-vault-server.onrender.com)                 |
| 📦  | **Frontend Repo** | [github.com/tanzid-48/life_vault](https://github.com/tanzid-48/life_vault)               |
| 🖥️  | **Backend Repo**  | [github.com/tanzid-48/life_vault_server](https://github.com/tanzid-48/life_vault_server) |

---

## 📖 About

**LifeVault** is a full-stack web platform where users can create, store, and share meaningful life lessons, personal growth insights, and wisdom gathered over time.


### Why LifeVault?

- 🧠 Our brains forget **70%+ of new information** within 24 hours — writing it down locks it in
- 📝 Writing a lesson forces deep reflection on what truly happened and what it meant
- 🌍 Browse thousands of real lessons from real people who have been where you are
- ❤️ Share hard-won insights — your experience might change someone's life

---

## 🛠️ Tech Stack

### Frontend

| Package                      | Version         | Purpose                     |
| ---------------------------- | --------------- | --------------------------- |
| `next`                       | 15 (App Router) | Full-stack React framework  |
| `react`                      | 19              | UI library                  |
| `better-auth`                | latest          | Auth — email + Google OAuth |
| `tailwindcss`                | v4              | Utility-first CSS           |
| `shadcn/ui`                  | latest          | Component library           |
| `lucide-react`               | latest          | Icon set                    |
| `framer-motion`              | latest          | ✅ Animations (required)    |
| `next-themes`                | latest          | Dark / Light theme toggle   |
| `sonner`                     | latest          | Toast notifications         |
| `stripe + @stripe/stripe-js` | latest          | Payment processing          |
| `embla-carousel-react`       | latest          | Hero slider                 |
| `@react-pdf/renderer`        | latest          | Export lesson as PDF        |

### Backend

| Package   | Version | Purpose               |
| --------- | ------- | --------------------- |
| `express` | 4       | REST API server       |
| `mongodb` | latest  | Native Atlas driver   |
| `stripe`  | latest  | Webhook + payments    |
| `dotenv`  | latest  | Environment variables |
| `cors`    | latest  | Cross-origin requests |

---

## 🗄️ Database Architecture

```
MongoDB Atlas
│
├── life_vault_db                    ← Application data
│   ├── lessons      title, description, category, emotionalTone,
│   │                accessLevel, userId, isPublic, views, likes, featured
│   ├── favorites    userId, lessonId, createdAt
│   ├── comments     lessonId, content, userId, userName, createdAt
│   └── reports      lessonId, reporterUserId, reason, resolved, createdAt
│
└── life_vault_auth_db               ← better-auth managed
    ├── user         name, email, role, isPremium, suspended, image
    ├── session      token, userId, expiresAt
    └── account      provider, userId (Google OAuth)
```

---

## 👥 Roles & Access Control

| Feature                | Free User | Premium User | Admin     |
| ---------------------- | --------- | ------------ | --------- |
| Lesson creation        | 5/month   | Unlimited    | Unlimited |
| Premium lesson access  | ❌ Locked | ✅ Full      | ✅ Full   |
| Create premium lessons | ❌        | ✅           | ✅        |
| Ad-free experience     | ❌        | ✅           | ✅        |
| Priority listing       | ❌        | ✅           | ✅        |
| Verified badge         | ❌        | ⭐           | ⭐        |
| Manage all users       | ❌        | ❌           | ✅        |
| Delete any lesson      | ❌        | ❌           | ✅        |
| Feature lessons        | ❌        | ❌           | ✅        |

### 🔴 Suspend User Flow

When an admin suspends a user:

```
Admin clicks Suspend
       ↓
PATCH /admin/users/:id/suspend → { suspended: true }
       ↓
MongoDB: user.suspended = true
       ↓
User tries to access any page
       ↓
layout.jsx: getSession() → user.suspended === true
       ↓
redirect("/suspended")
       ↓
/suspended page: "Your account has been suspended. Contact admin."
       ↓
Admin can unsuspend anytime → suspended: false → access restored ✅
```

---

## 📄 Pages & Routes

### Public Pages

| Route              | Description                                                                  |
| ------------------ | ---------------------------------------------------------------------------- |
| `/`                | Landing — hero slider, featured lessons, how it works, pricing, contributors |
| `/lessons`         | Browse public lessons (search, filter, sort, pagination)                     |
| `/lessons/[id]`    | Lesson detail — content, like, favorite, comments, related                   |
| `/pricing`         | Free vs Premium comparison + Stripe checkout (৳1500 one-time)                |
| `/pricing/success` | Payment success — premium unlocked                                           |
| `/pricing/cancel`  | Payment cancelled                                                            |
| `/signin`          | Email + Google OAuth signin                                                  |
| `/signup`          | Account creation (default role: user)                                        |
| `/suspended`       | Shown to suspended users                                                     |

### User Dashboard

| Route                             | Description                                        |
| --------------------------------- | -------------------------------------------------- |
| `/dashboard/home`                      | Stats, weekly chart, recent lessons, quick actions |
| `/dashboard/user/add-lesson`           | Create lesson form                                 |
| `/dashboard/user/my-lessons`           | Manage — visibility, access, edit, delete          |
| `/dashboard/user/my-lessons/[id]/edit` | Edit form (owner only)                             |
| `/dashboard/user/my-favorites`         | Saved lessons with filter                          |
| `/dashboard/user/profile`              | Profile view + edit + public lesson grid           |

### Admin Dashboard

| Route                               | Description                                     |
| ----------------------------------- | ----------------------------------------------- |
| `/dashboard/admin`                  | Platform analytics, bar chart, top contributors |
| `/dashboard/admin/manage-users`     | Search, role, suspend/activate, delete          |
| `/dashboard/admin/manage-lessons`   | Feature, review, delete any lesson              |
| `/dashboard/admin/reported-lessons` | Grouped reports, reasons modal, resolve/delete  |
| `/dashboard/admin/profile`          | Admin profile + platform stats                  |

---

## 📡 API Reference

### Lessons

| Method + Endpoint           | Auth   | Description                            |
| --------------------------- | ------ | -------------------------------------- |
| `GET /lessons`              | Public | Paginated — search, filter, sort       |
| `GET /lessons/featured`     | Public | Admin-marked featured                  |
| `GET /lessons/most-saved`   | Public | Highest favorites count                |
| `GET /lessons/weekly-stats` | Public | Daily counts last 7 days               |
| `GET /lessons/:id`          | Public | Single lesson + view++                 |
| `GET /my-lessons/:userId`   | Token  | Owner's all lessons (public + private) |
| `POST /lessons`             | Token  | Create lesson                          |
| `PATCH /lessons/:id`        | Token  | Update (owner only)                    |
| `DELETE /lessons/:id`       | Token  | Delete (owner or admin)                |
| `POST /lessons/:id/like`    | Token  | Toggle like                            |

### Favorites, Comments, Reports

| Method + Endpoint                 | Auth   | Description        |
| --------------------------------- | ------ | ------------------ |
| `POST /favorites/:lessonId`       | Token  | Toggle favorite    |
| `GET /favorites/:lessonId/status` | Token  | Check if favorited |
| `GET /favorites`                  | Token  | All user favorites |
| `GET /comments?lessonId=`         | Public | All comments       |
| `POST /comments`                  | Token  | Add comment        |
| `POST /reports`                   | Token  | Report a lesson    |

### Admin

| Method + Endpoint                        | Auth  | Description                |
| ---------------------------------------- | ----- | -------------------------- |
| `GET /admin/stats`                       | Admin | Platform analytics         |
| `GET /admin/users`                       | Admin | All users + lesson count   |
| `PATCH /admin/users/:id/role`            | Admin | Change user role           |
| `PATCH /admin/users/:id/suspend`         | Admin | Suspend / activate         |
| `DELETE /admin/users/:id`                | Admin | Delete user + lessons      |
| `GET /admin/lessons`                     | Admin | All lessons + report count |
| `PATCH /admin/lessons/:id/feature`       | Admin | Toggle featured            |
| `DELETE /admin/lessons/:id`              | Admin | Delete lesson              |
| `GET /admin/reports`                     | Admin | Reports grouped by lesson  |
| `PATCH /admin/reports/resolve/:lessonId` | Admin | Resolve reports            |

---

## 💳 Stripe Payment Flow

```
User clicks "Upgrade to Premium"
        ↓
POST /api/checkout_sessions
  → stripe.checkout.sessions.create({ metadata: { userId } })
  → redirect to Stripe Checkout
        ↓
User pays ৳1,500
        ↓
    ┌── Success → /pricing/success
    │   (webhook fires in background)
    └── Cancel  → /pricing/cancel

Stripe Webhook → POST /api/webhook
  → constructEvent() verify signature
  → checkout.session.completed
  → PATCH /users/:id/premium → isPremium: true ✅

Next request:
  → user.isPremium = true
  → Upgrade button hidden ✅
  → Premium lessons unlocked ✅
```

---

## 🔐 Security Layers

| Layer           | Implementation                                         |
| --------------- | ------------------------------------------------------ |
| `middleware.js` | Session cookie check → redirect `/signin`              |
| `layout.jsx`    | `getSession()` role + suspended check                  |
| `verifyToken`   | JWT looked up in MongoDB `sessionCollection`           |
| `verifyAdmin`   | `req.user.role === 'admin'`                            |
| Owner guard     | `lesson.userId === req.user._id` on PATCH/DELETE       |
| Premium guard   | `accessLevel=premium` blocked if `!req.user.isPremium` |
| Suspended guard | `suspended === true` → `/suspended` page               |
| Stripe webhook  | `constructEvent()` signature verification              |

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Stripe account (test mode)
- Google OAuth credentials

### 1 — Clone

```bash
git clone https://github.com/tanzid-48/life_vault.git
git clone https://github.com/tanzid-48/life_vault_server.git
```

### 2 — Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/
CLIENT_URL=https://life-vault-smoky.vercel.app
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

```bash
cd life_vault_server && npm install && node index.js
```

### 3 — Frontend `.env.local`

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
BETTER_AUTH_SECRET=your-32-char-secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

```bash
cd life_vault && npm install && npm run dev
```

### 4 — Create Admin

```js
// MongoDB Atlas → life_vault_auth_db → user collection
{ "$set": { "role": "admin" } }
```

Then visit `/dashboard/admin` ✅

---

## 🌐 Deployment

### Frontend → Vercel

```bash
# Push to GitHub → connect to Vercel → add env vars → deploy
# Auto-deploys on every git push to main
```

### Backend → Render

| Setting       | Value                                                               |
| ------------- | ------------------------------------------------------------------- |
| Build Command | `npm install`                                                       |
| Start Command | `node index.js`                                                     |
| Env Vars      | `MONGODB_URI, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, CLIENT_URL` |

> ⚠️ Set `CLIENT_URL=https://life-vault-smoky.vercel.app` in Render env vars for CORS.

---

## ✅ Features Checklist

| Feature                               | Status         |
| ------------------------------------- | -------------- |
| Auth (email + Google OAuth)           | ✅             |
| Role system (user / admin)            | ✅             |
| Lesson CRUD with owner guard          | ✅             |
| Public lessons browse                 | ✅             |
| **Search + Filter + Sort**            | ✅ Challenge 1 |
| **Token verification**                | ✅ Challenge 2 |
| **Pagination**                        | ✅ Challenge 3 |
| Premium system (Stripe)               | ✅             |
| Like / Favorite / Comment / Report    | ✅             |
| Admin manage users                    | ✅             |
| Admin manage lessons                  | ✅             |
| Reported lessons panel                | ✅             |
| Home page (6 sections, framer-motion) | ✅             |
| Hero slider (embla-carousel)          | ✅             |
| Dark / Light theme                    | ✅             |
| Export lesson as PDF                  | ✅             |
| Loading states (Suspense + skeleton)  | ✅             |
| Suspend user → /suspended page        | ✅             |
| Deploy (Vercel + Render)              | ✅             |

---

## 📁 Project Structure

```
life_vault/ (Frontend)
├── src/app/
│   ├── (auth)/signin/          Sign In
│   ├── (auth)/signup/          Sign Up
│   ├── lessons/                Browse + Detail
│   ├── dashboard/home/         User dashboard
│   ├── dashboard/add-lesson/   Create lesson
│   ├── dashboard/my-lessons/   Manage lessons
│   ├── dashboard/my-favorites/ Saved lessons
│   ├── dashboard/profile/      User profile
│   ├── dashboard/admin/        Admin panel (5 pages)
│   ├── pricing/                Plans + success + cancel
│   ├── suspended/              Suspended user page
│   └── api/checkout_sessions/  Stripe route
│
├── src/components/
│   ├── LessonCard.jsx          Premium blur overlay
│   ├── Navbar.jsx              Role-aware + theme toggle
│   ├── Footer.jsx
│   ├── ThemeToggle.jsx
│   ├── dashboard/AppSidebar.jsx
│   └── home/                   6 home sections
│
└── src/lib/
    ├── auth-session.js         getSession, getAuthHeaders
    ├── action/lessons.js       createLesson, updateLesson
    ├── action/lessonDetail.js  toggleLike, toggleFavorite, etc.
    ├── action/admin.js         Admin server actions
    ├── api/admin.js            Admin data fetching
    └── api/home.js             Featured, contributors, etc.

life_vault_server/ (Backend)
└── index.js                    All Express routes + middleware
    ├── verifyToken             JWT middleware
    ├── verifyAdmin             Role guard
    ├── /lessons/*              CRUD + like + featured
    ├── /my-lessons/:userId     Owner's all lessons
    ├── /favorites/*            Toggle + status
    ├── /comments/*             Get + post
    ├── /reports/*              Post report
    ├── /admin/*                Users, lessons, reports, stats
    └── /users/:id/premium      Stripe webhook update
```

---

## 🗺️ User Flows

```
── REGULAR USER ──────────────────────────────────────────

  /signup (role: user)
      ↓
  Browse /lessons → filter + search → /lessons/:id
      ↓
  Like / Favorite / Comment / Report
      ↓
  /dashboard/home → Add Lesson → /dashboard/my-lessons
      ↓
  Want Premium → /pricing → Stripe → isPremium: true ✅


── ADMIN ─────────────────────────────────────────────────

  MongoDB: role = "admin"
      ↓
  /dashboard/admin → real-time stats
      ↓
  Manage Users → suspend / promote / delete
      ↓
  Manage Lessons → feature / review / delete
      ↓
  Reported Lessons → resolve / delete


── SUSPENDED USER ────────────────────────────────────────

  Admin clicks Suspend
      ↓
  user.suspended = true in DB
      ↓
  User visits any page
      ↓
  layout.jsx checks → redirect /suspended ✅
```

---

## 🔖 Commit Convention

| Prefix      | Use For          |
| ----------- | ---------------- |
| `feat:`     | New feature      |
| `fix:`      | Bug fix          |
| `refactor:` | Code improvement |
| `style:`    | UI / styling     |
| `docs:`     | Documentation    |
| `chore:`    | Config / deps    |


---

## 📄 License

```
MIT License — Free to use, modify, and distribute.
```

---

<div align="center">

<br/>

**Built with ❤️ by [Tanzid](https://github.com/tanzid-48)**

_Pundra University of Science and Technology (PUB) · CSE · 23rd Batch · 2026_

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-tanzid--48-181717?style=for-the-badge&logo=github)](https://github.com/tanzid-48)
[![Live](https://img.shields.io/badge/Live-LifeVault-7C3AED?style=for-the-badge)](https://life-vault-smoky.vercel.app)

<br/>

_⭐ Star this repo if LifeVault helped you!_

</div>
