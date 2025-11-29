# Backend Architecture

This document outlines the backend architecture for the NC Properties web application. Our goal is to use a modern, scalable, and integrated stack that leverages the power of Next.js and the Firebase ecosystem.

## Core Technologies

- **Framework**: [Next.js](https://nextjs.org/) (App Router) will be used for both frontend and backend logic, leveraging Server Components and Server Actions.
- **Hosting**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) for deploying our Next.js application.
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) for managing user accounts, including social sign-in.
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) will be our primary NoSQL database for storing all application data.
- **File Storage**: [Firebase Storage](https://firebase.google.com/docs/storage) for handling all user-generated content like images and documents.
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) for implementing any AI-powered features, such as description generation or image analysis.

## Data Flow

1.  **Frontend (React Components)**: The user interacts with the UI.
2.  **Server Actions / API Routes**: Client-side requests are handled by Next.js Server Actions (for form submissions and mutations) or API Routes (for data fetching).
3.  **Firebase Services**: The server-side logic interacts with Firebase services (Firestore, Storage, Auth) using the Firebase Admin SDK for secure operations.
4.  **Data Response**: Data is fetched from Firebase and returned to the server components for rendering or sent back to client components as JSON.

## Key Advantages of this Architecture

- **Integrated Stack**: Tightly integrated services from Firebase and Google Cloud reduce complexity.
- **Scalability**: Firestore and Firebase Storage are designed for massive scale.
- **Developer Experience**: Next.js App Router with Server Actions provides a streamlined workflow for building full-stack features.
- **Security**: Firebase provides robust security rules for Firestore and Storage, along with secure authentication.
