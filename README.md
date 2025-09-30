# 🍔 Mobile‑Order (Next.js App Router)

### Live on Vercel

https://mobile-order-taupe.vercel.app/

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Setup](#setup)
3. [Tech Highlights](#tech-highlights)
4. [Extra Features](#extra-features)
5. [AI Usage Report](#ai-usage-report)

---

## Project Overview

This app is a simple mobile order system and admin dashboard. It uses Next.js App Router.

- Customer: see menu → add to cart → place order → see history
- Staff: update order status on the order list
- Admin: manage menu, see sales, manage staff
- Deploy: Vercel + Vercel Postgres (Neon) + Cloudinary

---

## Setup

### 1) Requirements

- Node.js 18+
- pnpm or npm or yarn
- Git / GitHub

### 2) Get the repository

```bash
git clone https://github.com/shouta256/mobile-order.git
cd mobile-order
```

### 3) Install and Prisma

```bash
# install dependencies
npm i

# create your env file
cp .env.example .env.local
```

Main .env items:

| Key                                   | Description                      |
| ------------------------------------- | -------------------------------- |
| `DATABASE_URL`                        | Postgres URL (e.g. Neon)         |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL`    | For NextAuth                     |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | For Google OAuth          |
| `CLOUDINARY_*`                        | For image upload                 |

```bash
# DB migrate and seed
npx prisma migrate deploy
npx prisma db seed
```

### 4) Start dev server

```bash
npm run dev
# open http://localhost:3000
```

> Using pnpm?

```bash
pnpm install
pnpm dev
pnpm lint  # run Biome lint
```

### 5) Build and run

```bash
npm run build && npm start
```

---

## Tech Highlights

| Area                     | Point                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| Next.js App Router       | Split Server/Client Components to improve UX. Keep `use client` small. |
| DB & ORM                 | Neon (Postgres) + Prisma. Safe types.                                  |
| Auth                     | NextAuth v4: credentials + Google OAuth.                               |
| Cart                     | `useCart` hook with localStorage sync.                                 |
| Images                   | Cloudinary URLs saved in DB. Use `<Image>` for optimization.           |
| Responsive UI            | Tailwind CSS. Mobile-first layout.                                     |
| Type Safety              | Prisma types + `zod` for server actions.                               |
| Analytics                | Recharts + Prisma for charts.                                          |
| Store Settings           | One record in Prisma to control site design.                           |
| Performance              | ISR caching, dynamic import, memo/callback to reduce re-render.        |

---

## Extra Features

| Feature                        | Why                                                             |
| ------------------------------ | ---------------------------------------------------------------- |
| Staff and Admin roles          | Separate kitchen work and admin work.                            |
| Sales dashboard                | See sales by day and popular menu.                               |
| Cloudinary upload              | Easy image upload and CDN.                                       |
| Mobile navigation (drawer)     | Better UX on phones.                                             |
| Challenge (gamification, demo) | Idea to increase repeat users (only UI, not implemented).        |
| Store design settings          | Change hero image, copy, colors in GUI. Apply changes quickly.   |

---

## AI Usage Report

### 1) Tools

| Tool              | Use case                                     |
| ----------------- | -------------------------------------------- |
| ChatGPT (GPT‑4o)  | UI help, code review, errors, DB, README     |
| Bolt.new          | Make the home page UI                        |
| Claude 3 Sonnet   | Small UI improvements                         |

### 2) When and why

1. Data model design – get ideas for Prisma schema.
2. Server Actions validation – make `zod` schemas.
3. Regex – check email and password formats.
4. Debug – share build errors and get tips.

### 3) Example prompts

“Make a dashboard with Recharts. Show a line chart and a pie chart. I want sales by day and popular menu.”

“Write a Prisma seed script for 30 days of dummy orders and order items.”

> Note: I always check AI code locally and review security before commit.
