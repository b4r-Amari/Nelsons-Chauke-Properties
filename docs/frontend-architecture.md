# Frontend Architecture & Data Flow

This document explains how the NC Properties frontend is structured, focusing on how data is fetched from and sent to the Firebase backend.

## 1. Core Principles & Technologies

- **Framework**: [Next.js](https://nextjs.org/) with the App Router.
- **Rendering Strategy**: A mix of **Server Components** and **Client Components**.
  - **Server Components (Default)**: Most pages are Server Components. They run exclusively on the server, fetching data directly and rendering static HTML. This is excellent for performance and SEO.
  - **Client Components (`"use client"`)**: Components requiring user interaction (e.g., forms, buttons with state) or browser-specific APIs are marked as Client Components.
- **Data Fetching**: Primarily done on the server within Server Components.
- **Data Mutation**: Handled by client-side functions that call secure Firebase services.

## 2. Data Flow: Fetching Data (Reading from Firestore)

The primary goal is to fetch data on the server whenever possible.

### The Data Layer: `src/lib/data.ts`

- This file acts as the central repository for all data-fetching logic.
- Functions like `getProperties()`, `getAgents()`, and `getBlogPosts()` reside here.
- These functions use the Firebase Client SDK (`firebase/firestore`) to query the database.
- **Example**: `getProperties()` queries the `properties` collection in Firestore and returns an array of property objects.

### How Pages Get Data (Server-Side)

This is the preferred method for displaying data.

1.  **Page as a Server Component**: A page like `/app/properties/page.tsx` is an `async` React component.
2.  **Direct Data Fetching**: Inside the component, it directly calls and `await`s a function from `src/lib/data.ts`.
    ```tsx
    // src/app/properties/page.tsx
    import { getProperties } from '@/lib/data';

    export default async function PropertiesPage() {
      const properties = await getProperties(); // Data is fetched on the server
      // ...
      return (
        <PropertyListings initialProperties={properties} />
      );
    }
    ```
3.  **Rendering**: The page is fully rendered on the server with the fetched data. The client receives complete HTML, resulting in a fast initial load.

## 3. Data Flow: Mutating Data (Writing to Firestore)

All data mutations (creating, updating, deleting) are initiated from the client side in response to user actions, like submitting a form or clicking a button.

### The Action Layer: `src/lib/firebase/firestore.ts`

- This file contains all functions that write data to Firestore, such as `addProperty`, `updateAgent`, `deleteBlogPost`, etc.
- These functions are marked with `"use client";` because they are called from Client Components.
- They use the Firebase Client SDK to perform write operations (`addDoc`, `updateDoc`, `deleteDoc`).

### How Mutations Work (Client-Side)

1.  **User Interaction**: A user fills out a form (e.g., the "Add New Agent" form, which is a Client Component).
2.  **Form Submission**: The form's `onSubmit` handler is triggered.
3.  **Calling the Action**: The handler calls the corresponding function from `src/lib/firebase/firestore.ts`.
    ```tsx
    // src/app/admin/agents/new/page.tsx
    import { addAgent } from "@/lib/firebase/firestore";
    import { useForm } from "react-hook-form";

    // ... (inside the component)
    async function onSubmit(values) {
      const result = await addAgent(values); // Calls the Firestore function
      if (result.success) {
        toast({ title: "Agent Created" });
        router.push('/admin/agents');
      }
    }
    ```
4.  **Security**: Although the action is initiated on the client, **Firestore Security Rules** (`firestore.rules`) on the backend ensure that only authenticated admins can successfully perform these write operations. Any unauthorized attempt is rejected by the database itself.

## 4. Authentication Flow

- **Context Provider**: `src/context/auth-context.tsx` provides a `useAuth` hook to access the current user's state (`user`, `isAdmin`, `isLoading`).
- **Login Process**: The login page uses Firebase Authentication (`signInWithEmailAndPassword`) to verify the user.
- **Admin Check**: The `AuthProvider` checks if the authenticated user's ID exists in the `adminUsers` collection in Firestore.
- **Protected Routes**: The `AuthProvider` also contains logic to automatically redirect any non-admin users away from `/admin/*` routes, preventing unauthorized access without delays or content flashing.

This architecture prioritizes server-side rendering for speed and SEO while leveraging Firebase's secure client-side SDKs for authentication and data mutations, all enforced by robust backend security rules.
