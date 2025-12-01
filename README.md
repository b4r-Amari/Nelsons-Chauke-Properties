
# NC Properties - Real Estate Platform

Welcome to the NC Properties web application, a full-featured real estate platform built with a modern, high-performance tech stack. This application provides a seamless experience for potential buyers, sellers, and renters, alongside a powerful administrative dashboard for content and property management.

## Core Features

### Public-Facing Website

- **Dynamic Homepage**: Features a hero section with a property search filter, a carousel of featured listings, and calls-to-action for buying, selling, and renting.
- **Advanced Property Search**: A comprehensive listings page (`/properties`) with multi-faceted filtering (location, price, type, beds, etc.) and sorting capabilities.
- **Detailed Property Pages**: Each property has a dedicated page with an image gallery, detailed specifications, agent information, an enquiry form, and an embedded home loan calculator.
- **Specialized Views**: Dedicated pages for properties that are currently "On Show" and an archive for "Sold" properties.
- **Agent Profiles**: An "About Us" page showcasing the company timeline and team, with individual profile pages for each agent that display their biography and active listings.
- **Content-Rich Blog**: A "Property News" section with articles that support rich text formatting, a featured post, and category-based organization.
- **Financial Calculators**: A suite of tools to help users plan their finances, including:
  - Home Loan / Bond Repayment Calculator
  - Affordability Calculator
  - Additional Payment Savings Calculator
  - Bond and Transfer Cost Calculator
- **Lead Generation**: Forms for property valuations, general contact, and specific property enquiries.

### Administrative Dashboard (`/admin`)

- **Secure Login**: A separate, secure portal for administrators.
- **Centralized Dashboard**: An at-a-glance overview of key metrics like total properties, agents, and blog posts, with quick-action links.
- **Full CRUD Operations**: Complete Create, Read, Update, and Delete functionality for:
  - **Properties**: Add, edit, and delete property listings.
  - **Agents**: Manage agent profiles.
  - **Blogs**: Create, edit, and delete articles.
- **Rich Text Editor**: A "Word-like" editor for creating and editing blog post content with rich formatting (headings, lists, bold, etc.).
- **Theme Customization**: Includes a dark mode toggle for improved usability in different lighting conditions.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) for component primitives.
- **Database**: [Google Firestore](https://firebase.google.com/docs/firestore) (NoSQL)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/hosting)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A Firebase project with Firestore and Authentication enabled.

### 1. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add your Firebase project credentials. You can get these from your Firebase project settings.

```bash
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"

# For the geocoding script
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 2. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 3. Seed the Database

To populate your Firestore database with the initial sample data (properties, agents, and blog posts), you first need to authenticate the Firebase Admin SDK.

**Authentication:**
Ensure you have the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed. Log in with the following command:
```bash
gcloud auth application-default login
```

Then, run the seed script:

```bash
npm run db:seed
```

This script checks if the collections are empty before seeding to prevent overwriting existing data.

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.
- The public site can be viewed at `http://localhost:9002`.
- The admin panel is available at `http://localhost:9002/admin`.
