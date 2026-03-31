
# NC Properties - Real Estate Platform

Welcome to the NC Properties web application, a full-featured real estate platform built with a modern, high-performance tech stack. This application provides a seamless experience for potential buyers, sellers, and renters, alongside a powerful administrative dashboard for content and property management.

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for component primitives.
- **Database**: [Supabase PostgreSQL](https://supabase.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Storage**: [Supabase Storage](https://supabase.com/storage)
- **Deployment**: [Vercel](https://vercel.com/) (Recommended)

## Getting Started

### 1. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 2. Seed the Database

To populate your Supabase database with initial sample data:

```bash
npm run db:seed
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.
- The admin panel is available at `http://localhost:9002/admin`.
