# Firestore Database Schema

This document outlines the proposed data structure for the Cloud Firestore database.

## Collections

### `users`

Stores public-facing user profile information.

- **Path**: `/users/{userId}`
- **Document ID**: Firebase Auth User ID (`uid`)
- **Schema**:
  - `uid`: (string) The user's unique ID.
  - `email`: (string) The user's email address.
  - `displayName`: (string) The user's display name.
  - `photoURL`: (string) URL to the user's profile picture.
  - `createdAt`: (timestamp) Server timestamp of account creation.
  - `isAdmin`: (boolean, optional) Flag to denote administrator status.

### `agents`

Stores profiles for real estate agents.

- **Path**: `/agents/{agentId}`
- **Document ID**: Auto-generated ID.
- **Schema**:
  - `name`: (string) Agent's full name.
  - `role`: (string) Agent's role (e.g., "Head of Sales").
  - `imageUrl`: (string) URL to profile picture in Firebase Storage.
  - `phone`: (string) Contact phone number.
  - `email`: (string) Contact email.
  - `bio`: (string) Agent's biography (can contain Markdown/HTML).
  - `isActive`: (boolean) Whether the agent is currently active.

### `properties`

Stores all property listings.

- **Path**: `/properties/{propertyId}`
- **Document ID**: Auto-generated ID.
- **Schema**:
  - `address`: (string) Full street address.
  - `location`: (string) Suburb and province (e.g., "Sandton, Gauteng").
  - `price`: (number) Listing price in ZAR.
  - `status`: (string) "for-sale", "to-let", or "sold".
  - `type`: (string) "House", "Apartment", etc.
  - `beds`: (number) Number of bedrooms.
  - `baths`: (number) Number of bathrooms.
  - `sqft`: (number) Interior size in square meters.
  - `erfSize`: (number) Land size in square meters.
  - `description`: (string) Detailed property description.
  - `features`: (array of strings) List of property features.
  - `imageUrls`: (array of strings) URLs to images in Firebase Storage.
  - `agentIds`: (array of strings) Document IDs of assigned agents from the `agents` collection.
  - `isFavorite`: (boolean) If the property is featured.
  - `onShow`: (boolean) If the property is currently on show.
  - `createdAt`: (timestamp) Server timestamp of listing creation.
  - `updatedAt`: (timestamp) Server timestamp of last update.

### `blogPosts`

Stores all blog articles.

- **Path**: `/blogPosts/{postId}`
- **Document ID**: Auto-generated ID or a URL-friendly slug.
- **Schema**:
  - `slug`: (string) URL-friendly identifier.
  - `title`: (string) The article title.
  - `author`: (string) Name of the author.
  - `date`: (timestamp) Publication date.
  - `imageUrl`: (string) URL to the featured image in Firebase Storage.
  - `category`: (string) e.g., "Buying Guide".
  - `excerpt`: (string) A short summary of the post.
  - `content`: (string) The full content of the post (can contain Markdown/HTML).

### `enquiries`

Stores contact/enquiry form submissions.

- **Path**: `/enquiries/{enquiryId}`
- **Document ID**: Auto-generated ID.
- **Schema**:
  - `name`: (string) User's name.
  - `email`: (string) User's email.
  - `phone`: (string) User's phone number.
  - `message`: (string) User's message.
  - `propertyId`: (string, optional) ID of the property the enquiry is about.
  - `source`: (string) "Contact Form", "Property Enquiry", "Valuation Request".
  - `isRead`: (boolean) Whether the enquiry has been addressed.
  - `createdAt`: (timestamp) Server timestamp.
