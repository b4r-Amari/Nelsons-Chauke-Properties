
# Frontend Architecture & Data Flow (Supabase Edition)

This document explains the modern, server-centric architecture of the NC Properties application, optimized for Supabase and Next.js 15.

## 1. Core Principles & Technologies

- **Framework**: [Next.js 15](https://nextjs.org/) with the App Router.
- **Rendering Strategy**: **Server-First Architecture**.
  - **Server Components (Default)**: All pages fetching data (`/`, `/properties`, `/admin/dashboard`, etc.) are Server Components. They fetch data directly from PostgreSQL on the server, resulting in zero client-side fetching overhead and superior SEO.
  - **Client Components (`"use client"`)**: Reserved exclusively for interactive elements like forms, carousels, and the Property Filter.
- **Data Fetching**: Performed on the server using the `@supabase/ssr` library.
- **Data Mutation**: Handled via **Next.js Server Actions**, providing a secure and simple way to update data without creating custom API endpoints.

## 2. Data Flow: Reading Data (The Server-Side Layer)

Data fetching is direct and efficient.

### The Data Access Layer: `src/lib/data.ts`
- Functions like `getProperties()` and `getAgents()` instantiate a Supabase Server Client.
- They query the database using the official Supabase SDK and return strongly-typed objects.

### Page Implementation
```tsx
// src/app/properties/page.tsx
import { getProperties } from '@/lib/data';

export default async function PropertiesPage() {
  const properties = await getProperties(); // direct server-to-db call
  return <PropertyListings initialProperties={properties} />;
}
```

## 3. Data Flow: Writing Data (Server Actions)

All state-changing operations happen on the server.

### The Action Layer: `src/lib/supabase/actions.ts`
- Contains functions marked with `'use server';`.
- **Example**: `updateProperty` validates inputs, performs the DB update, and calls `revalidatePath` to instantly refresh the cache for all users.

## 4. Route Protection & Security

- **Middleware Bouncer**: `src/middleware.ts` intercept every request. It handles Supabase session refreshing and enforces strict access control for the `/admin` routes.
- **Admin Authorization**: Middleware queries the `public.users` table's `is_admin` flag. If a non-admin attempts to access the dashboard, they are instantly redirected before any page content is rendered.
- **Row Level Security (RLS)**: Policies in PostgreSQL (`docs/database-schema.md`) provide a final layer of defense, ensuring that even if a request bypasses the application logic, the database itself will reject unauthorized operations.

## 5. Storage Flow

- Property images and agent photos are stored in **Supabase Storage**.
- Public URLs are saved in the database, allowing for high-performance global image delivery via the Supabase CDN.
