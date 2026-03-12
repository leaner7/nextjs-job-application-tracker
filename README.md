# Job Application Tracker

A modern, full-stack Kanban-style job application tracking platform built with Next.js App Router, React, and MongoDB.

## 🚀 Features

- **Kanban Board Interface**: Drag-and-drop functional Kanban board to manage job applications effortlessly, powered by `@dnd-kit`.
- **Authentication**: Seamless credential-based user authentication using [Better-Auth](https://better-auth.com/).
- **Database Architecture**: Robust data layer modeling using MongoDB and Mongoose.
- **Modern UI Stack**: Fully styled using Tailwind CSS and pre-built components from `shadcn/ui`, featuring a sleek and responsive design.
- **Form Validation**: Type-safe and rigid form schemas strictly enforced using `react-hook-form` and `zod`.
- **CI/CD Integrated**: Pre-configured with GitHub Actions for automated linting and type-checking, optimized for frictionless deployments on Vercel.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Better-Auth](https://better-auth.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)

---

## 🏃 Getting Started

### 1. Clone & Install
Clone the repository and install the dependencies:

```bash
git clone https://github.com/leaner7/nextjs-job-application-tracker.git
cd nextjs-job-application-tracker
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory by copying the example:

```bash
cp .env.example .env.local
```

Update `.env.local` to match your configurations:
- `MONGODB_URI`: Your MongoDB connection string.
- `BETTER_AUTH_SECRET`: A secure, random 32-character string.
- `BETTER_AUTH_URL` & `NEXT_PUBLIC_BETTER_AUTH_URL`: Your site URL (default is `http://localhost:3000`).

### 3. Database Seeding (Optional)
To insert dummy data into your newly configured database to populate your Kanban board:
```bash
npm run seed
```

### 4. Run Development Server
Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚢 Continuous Integration & Deployment

### GitHub Actions
This repository features a standard CI pipeline (`.github/workflows/ci.yml`). On every push or PR to `main`, the workflow automates:
- Dependency installation
- Global Type Checking (`npx tsc --noEmit`)
- ESLint checks

### Deploying to Vercel
1. Log in to [Vercel](https://vercel.com/) and click "Add New Project".
2. Import this repository from your GitHub account.
3. Supply your Production Environment Variables (`MONGODB_URI`, `BETTER_AUTH_SECRET`, etc.).
4. Click **Deploy**. Vercel will automatically track `main` for CD.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/leaner7/nextjs-job-application-tracker/issues).
