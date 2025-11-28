# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Changelog**: Created this `CHANGELOG.md` file to track project changes.
- **My Wishlist Page**: Designed a user-specific wishlist page.
- **Blog Management**: Added a full blog management section to the admin dashboard, including pages to list and create new blog posts.
- **Admin Dashboard Updates**: Added stat cards and quick-action links for blog management to the main admin dashboard.
- **Back Button**: Created a reusable "Back" button component for easier navigation on detail pages.
- **Image Lightbox/Carousel**: Implemented an image lightbox on the property details page that functions as a full carousel.
- **Firebase Integration**:
    - Set up Firebase Firestore to replace static JSON files for dynamic data management of properties, agents, and blogs.
    - Implemented a user role system in Firestore, creating a `users` collection to distinguish between 'admin' and 'customer' roles.
    - Configured forms (Contact, Enquiry, Sell) to save submissions to Firestore.
- **Dynamic Sitemap**: Created a `sitemap.ts` file to automatically generate a sitemap for all pages, including dynamic property, blog, and agent pages, to improve SEO.
- **Calculators Dropdown**: Added a "Calculators" dropdown menu to the main header navigation, including links for Home Loan, Mortgage Bond, Affordability, and other financial calculators.

### Changed
- **Styling**: 
    - Reverted the primary and accent colors back to the original deep maroon and burgundy theme.
    - Added an overlay to the Hero and Newsletter sections to improve text readability.
- **Property Filter**:
    - Redesigned the property filter to match a more modern, full-width layout inspired by Property24.
    - Removed "Developments" and "Sold Prices" tabs.
    - Adjusted the `max-width` of the filter container.
    - Increased the font size, padding, and font-weight of the "Buy", "Rent", and "Agents" tabs to make them more prominent.
    - Set the active tab's underline color to the primary red (burgundy) color.
    - Repositioned the property filter on the listings page to "float" between the hero image and the results, preventing image stretching when advanced filters are opened.
- **Mobile Responsiveness**:
    - Conducted a full-site review to ensure all pages, including the admin panel, are mobile-friendly.
    - Adjusted layouts on the homepage, property details page, and admin pages to prevent horizontal scrolling and improve usability on small screens.
    - Made mobile header icons larger for better touch accessibility.
    - Fixed a layout shift issue caused by the mobile menu opening.
    - Re-aligned mobile header icons to the right side of the screen.
- **Hero Search**: Replaced the simple homepage hero search with the full, advanced `PropertyFilter` component, providing users with powerful search capabilities immediately.
- **Data Fetching**: Converted the application to fetch all data (properties, agents, blogs) from Firestore instead of static JSON files, then reverted to JSON to resolve persistent errors before re-integrating Firestore.
- **Authentication**:
    - Replaced pop-up authentication dialogs with a single, full-page login screen.
    - Replaced the user icon in the header with a more prominent "Sign In" button for logged-out users.
    - Implemented logic to save a user's Google profile picture on sign-up.
- **Header Navigation**: Simplified the main navigation by removing the "About Us" and "Contact Us" links.
- **Calculators**: Consolidated all financial calculators onto a single page using a tabbed interface for a more streamlined user experience. Redesigned all calculators with a consistent and modern two-column layout.

### Fixed
- **Build & Runtime Errors**: Resolved multiple build and runtime errors, including:
    - A recurring "Unexpected token 'div'" error by correcting the component structure in `property-filter.tsx`.
    - Several "is not defined" errors by adding missing component imports.
    - Invalid OpenGraph `og:type` errors on property detail pages.
- **Hydration Errors**: Fixed several "cannot be a descendant of <a>" hydration errors by removing nested link components.
- **Homepage Redirect**: Corrected a critical bug that caused the homepage to automatically redirect to the properties page upon loading.
- **Page Navigation**: Fixed a bug that broke sitewide navigation after attempting to make the "Agents" tab in the property filter a link.
- **UI/UX Bugs**:
    - Removed a duplicate close button from the mobile sidebar menu.
    - Corrected hover-state background colors on navigation elements, specifically fixing an issue where the "Properties" dropdown text turned white incorrectly.
    - Fixed an issue causing horizontal scroll on mobile due to carousel button positioning.
    - Removed an unwanted hover underline effect from the "Agents" tab link in the property filter for design consistency.

### Removed
- **Wishlist Feature**: Completely removed the wishlist feature to resolve persistent permission errors and simplify the codebase.
- **Sold Properties Page**: Deleted the "Sold Properties" page and all links pointing to it.
- **Duplicate Files**: Removed several duplicate component files that were causing build conflicts.
- **Header Links**: Removed "About Us" and "Contact Us" from the main header navigation to streamline the user experience.
- **`patch-package`**: Removed the `patch-package` dependency from `package.json` as it was not needed.
