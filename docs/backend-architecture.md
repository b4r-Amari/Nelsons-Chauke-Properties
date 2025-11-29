# Backend Architecture

This document outlines the proposed backend architecture for the NC Properties application.

## 1. Core Technologies

- **Authentication**: **Firebase Authentication** will be used for all user management, including email/password and social providers (Google). This provides a secure and scalable solution out-of-the-box.

- **Database**: **Cloud Firestore** will serve as our primary NoSQL database. Its flexible data model is ideal for storing properties, agents, blog posts, and user data. Real-time capabilities can be leveraged for features like live notifications.

- **File Storage**: **Firebase Storage** will be used for all user-generated content, such as property images and agent profile photos. This is more robust and scalable than storing direct URLs.

- **Server-Side Logic**: We will primarily use **Next.js API Routes and Server Actions**.
  - **API Routes** for RESTful-like endpoints that can be called from the client.
  - **Server Actions** for direct, secure form submissions and data mutations from React components.

- **AI & Generative Features**: We will continue to use **Genkit** for any AI-powered functionality, such as property description generation or image analysis.

## 2. Data Flow

1.  **Client (Next.js)**: The user interacts with the UI.
2.  **Authentication**: The client communicates directly with Firebase Authentication for sign-in, sign-up, and session management.
3.  **Data Requests**:
    - For data mutations (Create, Update, Delete), client components will invoke Server Actions.
    - For data queries (Read), client components will either call API Routes or use a custom hook that securely interacts with Firestore.
4.  **Server (Next.js)**: API Routes and Server Actions use the Firebase Admin SDK to securely interact with Firestore and Firebase Storage, enforcing business logic.
5.  **Firebase Backend**: Firestore and Storage persist the application data.

## 3. Deployment

- **Hosting**: The application is already configured for **Firebase App Hosting**, which will handle both the Next.js frontend and backend logic seamlessly.
- **Firebase Services**: Firestore database, Authentication rules, and Storage rules will be deployed via the Firebase CLI.
