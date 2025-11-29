# API & Server Actions Design

This document outlines the server-side functions required for the application. We will prioritize using Next.js Server Actions for mutations (creating, updating, deleting data) and API Routes or server-side `get` functions for data fetching.

## 1. Properties

### Data Fetching (`/lib/properties.ts`)

- **`getProperties(filters)`**: Fetches a list of properties, applying optional filters (location, price, type, etc.). Handles pagination.
- **`getPropertyById(id)`**: Fetches a single property by its document ID.
- **`getFeaturedProperties()`**: Fetches properties where `isFavorite` is true.

### Mutations (Server Actions in `/lib/actions/propertyActions.ts`)

- **`createProperty(formData)`**: Admin action. Creates a new property document in Firestore. Handles image uploads to Firebase Storage first, then saves the URL.
- **`updateProperty(id, formData)`**: Admin action. Updates an existing property document.
- **`deleteProperty(id)`**: Admin action. Deletes a property document and its associated images from Firebase Storage.
- **`reassignAgent(propertyId, agentId)`**: Admin action. Updates the `agentIds` field for a property.

## 2. Agents

### Data Fetching (`/lib/agents.ts`)

- **`getAgents()`**: Fetches all active agent profiles.
- **`getAgentBySlug(slug)`**: Fetches a single agent profile by their slug.

### Mutations (Server Actions in `/lib/actions/agentActions.ts`)

- **`createAgent(formData)`**: Admin action. Creates a new agent profile.
- **`updateAgent(id, formData)`**: Admin action. Updates an agent's profile.
- **`deleteAgent(id)`**: Admin action. Deletes an agent. (Should consider what happens to their assigned properties).

## 3. Blog

### Data Fetching (`/lib/blog.ts`)

- **`getBlogPosts()`**: Fetches a list of all published blog posts, sorted by date.
- **`getBlogPostBySlug(slug)`**: Fetches a single blog post.

### Mutations (Server Actions in `/lib/actions/blogActions.ts`)

- **`createBlogPost(formData)`**: Admin action. Creates a new blog post.
- **`updateBlogPost(id, formData)`**: Admin action. Updates a blog post.
- **`deleteBlogPost(id)`**: Admin action. Deletes a blog post.

## 4. Enquiries & Forms

### Mutations (Server Actions in `/lib/actions/enquiryActions.ts`)

- **`submitEnquiry(formData)`**: Public action. Creates a new document in the `enquiries` collection with type "enquiry".
- **`submitContactForm(formData)`**: Public action. Creates a new document in the `enquiries` collection with type "contact".
- **`submitValuationRequest(formData)`**: Public action. Creates a new document in the `enquiries` collection with type "valuation".

## 5. User Accounts

### Mutations (Server Actions in `/lib/actions/userActions.ts`)

- **`addToWishlist(userId, propertyId)`**: User action. Adds a property ID to the user's `wishlist` array in their `users` document.
- **`removeFromWishlist(userId, propertyId)`**: User action. Removes a property ID from the user's `wishlist`.
- **`updateUserProfile(userId, data)`**: User action. Allows users to update their profile information (e.g., `displayName`).
