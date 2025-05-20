# Restaurant Mobile Ordering System

A modern, full-stack restaurant ordering system built with Next.js and Prisma.

## Features

- **Customer Portal**
  - Browse menu items with images
  - Add items to cart and place orders
  - User authentication and profile management
  - View order history and status updates
  - Participate in promotional challenges

- **Admin Dashboard**
  - Menu management with image uploads
  - Order processing and management
  - Business analytics
  - Challenge creation and management

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Image Storage**: Cloudinary
- **Authentication**: Custom JWT-based auth

## Project Structure

```
/app
  /(customer)     # Customer-facing routes
    /menu
    /cart
    /orders
    /profile
    /challenges
  /(admin)        # Admin dashboard routes
    /admin/dashboard
    /admin/menu
    /admin/orders
    /admin/challenges
  /(auth)         # Authentication routes
    /auth/signin
    /auth/signup
/components       # Reusable UI components
  /ui             # Shadcn UI components
  /admin          # Admin-specific components
  /customer       # Customer-specific components
  /layout         # Layout components
/lib              # Utility functions and services
/hooks            # Custom React hooks
/prisma           # Database schema and migrations
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL
- Cloudinary account

### Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/restaurant-ordering.git
cd restaurant-ordering
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

4. Set up the database

```bash
npx prisma migrate dev
```

5. Run the development server

```bash
npm run dev
```

## Deployment

This project is configured for easy deployment on Vercel.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables on Vercel
4. Deploy!

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Cloudinary](https://cloudinary.com/)