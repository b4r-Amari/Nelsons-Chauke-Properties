# Firestore Database Schema

This document defines the data models and collections for the Cloud Firestore database.

## Collections

### `properties`

Stores all property listings.

- **Document ID**: Auto-generated
- **Fields**:
    - `slug`: `string` (e.g., "12-sandhurst-drive-sandhurst")
    - `status`: `string` ("for-sale", "to-let", "sold")
    - `type`: `string` ("House", "Apartment", "Townhouse", "Villa", "Vacant Land")
    - `location`: `string` (e.g., "Sandton, Gauteng")
    - `address`: `string` (e.g., "12 Sandhurst Drive, Sandhurst")
    - `price`: `number`
    - `beds`: `number`
    - `baths`: `number`
    - `sqft`: `number` (House size in m²)
    - `erfSize`: `number` (Lot size in m²)
    - `description`: `string`
    - `imageUrl`: `string` (URL to the main image in Firebase Storage)
    - `imageGallery`: `array<string>` (List of URLs to gallery images)
    - `isFavorite`: `boolean` (For featured properties)
    - `features`: `array<string>` (e.g., ["Swimming Pool", "Garden"])
    - `yearBuilt`: `number`
    - `onShow`: `boolean`
    - `agentIds`: `array<string>` (Array of document IDs from the `agents` collection)
    - `videoUrl`: `string` (Optional)
    - `createdAt`: `timestamp`
    - `updatedAt`: `timestamp`

### `agents`

Stores profiles for all real estate agents.

- **Document ID**: Auto-generated
- **Fields**:
    - `slug`: `string` (e.g., "natalia-cromwell")
    - `name`: `string`
    - `role`: `string`
    - `imageUrl`: `string` (URL to profile picture in Firebase Storage)
    - `phone`: `string`
    - `email`: `string`
    - `bio`: `string` (HTML content)
    - `isActive`: `boolean`
    - `createdAt`: `timestamp`
    - `updatedAt`: `timestamp`

### `blogPosts`

Stores all articles for the "Property News" section.

- **Document ID**: Auto-generated
- **Fields**:
    - `slug`: `string` (e.g., "first-time-home-buyer-guide")
    - `title`: `string`
    - `author`: `string`
    - `publishedAt`: `timestamp`
    - `imageUrl`: `string` (URL to featured image in Firebase Storage)
    - `category`: `string`
    - `excerpt`: `string`
    - `content`: `string` (HTML or Markdown content)
    - `isPublished`: `boolean`
    - `createdAt`: `timestamp`
    - `updatedAt`: `timestamp`

### `users`

Stores additional information for registered users, linked to Firebase Auth.

- **Document ID**: Firebase Auth UID
- **Fields**:
    - `email`: `string`
    - `displayName`: `string`
    - `role`: `string` ("user", "admin")
    - `createdAt`: `timestamp`
    - `wishlist`: `array<string>` (Array of property document IDs)

### `enquiries`

Stores all contact and valuation requests.

- **Document ID**: Auto-generated
- **Fields**:
    - `name`: `string`
    - `email`: `string`
    - `phone`: `string`
    - `subject`: `string` (Optional, for general contact)
    - `message`: `string`
    - `propertyId`: `string` (Optional, links to `properties` collection)
    - `type`: `string` ("contact", "enquiry", "valuation")
    - `isRead`: `boolean`
    - `createdAt`: `timestamp`
