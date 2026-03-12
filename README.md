# Job Application Tracker

A premium, high-performance Kanban-style job application tracking platform built with **Next.js 16**, **React 19**, and **MongoDB**. Designed with a sophisticated aesthetic featuring glassmorphism and smooth animations.

## 🚀 Features

- **Premium UI/UX**: Modern glassmorphism design with mesh gradients, dynamic blur effects, and smooth micro-animations.
- **Kanban Board**: Highly interactive drag-and-drop board powered by `@dnd-kit`, optimized for tracking applications through various stages.
- **Real-time Stats**: Instant dashboard overview of active trackers and offers received.
- **Modern UI**: Sleek and responsive design featuring glassmorphism and smooth micro-animations.
- **Secure Authentication**: Credential-based auth using [Better-Auth](https://better-auth.com/).
- **Robust Backend**: Type-safe Data Access Layer (DAL) and Server Actions integrated with MongoDB & Mongoose.
- **Testing Suite**: Comprehensive testing infrastructure with Vitest for unit tests and Playwright for E2E flows.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Server Actions)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State & DND**: [@dnd-kit](https://dndkit.com/), React Hooks
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Auth**: [Better-Auth](https://better-auth.com/)
- **Testing**: [Vitest](https://vitest.dev/) & [Playwright](https://playwright.dev/)

---

## 🏃 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/leaner7/nextjs-job-application-tracker.git
cd nextjs-job-application-tracker
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

- `MONGODB_URI`: Your MongoDB connection string.
- `BETTER_AUTH_SECRET`: Random 32-character string.
- `BETTER_AUTH_URL`: `http://localhost:3000`

### 3. Database Seeding (Optional)

Populate your board with demo data:

```bash
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

---

## 🧪 Testing

### Unit & Integration (Vitest)

Tests core logic and hooks like `useBoard`.

```bash
npm run test        # Run once
npm run test:watch  # Watch mode
```

### End-to-End (Playwright)

Validates full user journeys (Sign-up, Card movement).
_Note: Requires browser installation on first run._

```bash
npx playwright install
npm run test:e2e
```

## 🚢 Continuous Integration

The project uses **GitHub Actions** (`.github/workflows/ci.yml`) to automatically:

- Check types with TypeScript
- Lint with ESLint
- Run Vitest unit tests
