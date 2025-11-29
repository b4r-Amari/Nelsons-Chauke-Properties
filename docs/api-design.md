# API Design

This document provides an initial design for the API endpoints and Server Actions required for the application.

## 1. Authentication

Authentication will be handled on the client-side using the Firebase Authentication SDK. No custom API endpoints are needed for the core auth operations (sign-up, sign-in, sign-out).

However, we will need an endpoint to create a user profile document in Firestore after a new user signs up.

- **Server Action**: `createUserProfile(user: User)`
  - **Trigger**: Called client-side after a successful Firebase signup.
  - **Action**: Creates a new document in the `/users/{userId}` collection with the user's details.

## 2. Properties

- **API Route**: `GET /api/properties`
  - **Description**: Fetches a list of properties.
  - **Query Params**: `status`, `location`, `minPrice`, `maxPrice`, `beds`, `type`.
  - **Action**: Queries the `properties` collection in Firestore based on the filter parameters. Returns a list of properties.

- **API Route**: `GET /api/properties/{id}`
  - **Description**: Fetches a single property by its ID.
  - **Action**: Retrieves a single document from the `properties` collection.

- **Server Action**: `createProperty(data: PropertyData)`
  - **Description**: Creates a new property listing. Requires admin privileges.
  - **Action**: Adds a new document to the `properties` collection.

- **Server Action**: `updateProperty(id: string, data: Partial<PropertyData>)`
  - **Description**: Updates an existing property. Requires admin privileges.
  - **Action**: Updates a document in the `properties` collection.

## 3. Agents

- **API Route**: `GET /api/agents`
  - **Description**: Fetches all agent profiles.
  - **Action**: Retrieves all documents from the `agents` collection.

- **API Route**: `GET /api/agents/{id}`
  - **Description**: Fetches a single agent by their ID.
  - **Action**: Retrieves a single document from the `agents` collection.

- **Server Action**: `createAgent(data: AgentData)`
  - **Description**: Creates a new agent profile. Requires admin privileges.
  - **Action**: Adds a new document to the `agents` collection.

## 4. Blog Posts

- **API Route**: `GET /api/blog`
  - **Description**: Fetches all blog posts, sorted by date.
  - **Action**: Retrieves all documents from the `blogPosts` collection.

- **API Route**: `GET /api/blog/{slug}`
  - **Description**: Fetches a single blog post by its slug.
  - **Action**: Queries the `blogPosts` collection for a matching slug.

## 5. Enquiries

- **Server Action**: `submitEnquiry(data: EnquiryData)`
  - **Description**: Handles submissions from all contact/enquiry forms.
  - **Action**: Creates a new document in the `enquiries` collection.
