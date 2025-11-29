# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Property Details Page Redesign**:
    - Overhauled the property details page with a cleaner, borderless, all-white layout for a more modern feel.
    - Consolidated property specs (beds, baths, size) into a single, four-column row for better scannability.
    - Added a new, detailed "Property Details" section to display key information like listing number, rates, and levies.
    - Integrated a "Home Loan Calculator" directly onto the property details page for instant repayment estimates.
    - Implemented a responsive image gallery with a dynamic grid layout on desktop (one large image, two small) and a full-width view on mobile.
- **Floating Mobile Contact Bar**: Added a new floating contact bar at the bottom of the screen on mobile devices for the property details page, featuring quick actions for "Call", "WhatsApp", and "Email".
- **Sell Page Redesign**:
    - Transformed the "Sell" page into an informational guide, outlining a clear 4-step process for selling a property with NC Properties.
    - Streamlined the valuation request form by removing unnecessary fields (file upload, message) to simplify the user journey.
- **Calculator Descriptions**: Added descriptive text to each tab on the financial calculators page to clarify the purpose and function of each tool.

### Changed
- **Conditional Video Button**: The "Video" button on the property details action bar is now conditionally rendered, only appearing if a video URL exists for the property.
- **Action Bar Behavior**: The action bar (Photos, Map, Video) on the property details page is now static and scrolls with the page, instead of floating.
- **Mobile UI Enhancements**:
    - The "Make an Enquiry" form on the property details page is now hidden on mobile devices to avoid redundancy with the new floating contact bar.
    - The floating contact bar was styled with rounded corners and a small margin to give it a more modern appearance.
- **Property Filter Redesign**:
    - Overhauled the property filter to a modern, full-width layout inspired by Property24.
    - Removed "Developments" and "Sold Prices" tabs to simplify the interface.
    - Increased the font size and weight of the "Buy", "Rent", and "Agents" tabs to make them more prominent.
    - Set the active tab's underline color to the primary brand color for better visual feedback.
- **Property Listings Page**:
    - Removed the large header image to reduce clutter and focus on search results.
    - Repositioned the property filter to "float" between the hero image and the results, preventing layout shifts when advanced filters are opened.
- **Mobile Responsiveness**:
    - Increased the size of the mobile header menu icon for better usability.
    - Made the "Agents" tab in the property filter visible on mobile devices to ensure all navigation options are accessible.
    - Added responsive top padding to the "Featured Properties" section on the homepage to prevent overlap from the property filter on mobile.
    - Added padding to the homepage hero section to prevent the title from being obscured by the sticky header.
- **Admin Dashboard UI**:
    - Made admin dashboard "Quick Actions" cards stack vertically on smaller screens.
    - Hid less critical columns on admin tables ("Manage Agents", "Manage Blog Posts") to prevent horizontal scrolling on mobile devices.

### Fixed
- **Build & Runtime Errors**: 
    - Resolved a "Module not found" build error by correcting an invalid component import path.
    - Fixed a runtime error where `CollapsibleTrigger` was used outside a `Collapsible` component in the property filter.
    - Addressed an accessibility error in the mobile menu by adding a `SheetTitle`, which is required for screen readers.
- **Infinite Loop**: Corrected a "Maximum update depth exceeded" error caused by a circular dependency between the `PropertyListings` and `PropertyFilter` components.
- **UI Bugs**: 
    - Removed a duplicate close button from the mobile sidebar menu.
    - Corrected a layout issue in the property filter where adding labels to the size dropdowns disrupted the grid alignment.
    - Fixed a layout shift issue caused by the mobile menu opening.
    - Resolved a horizontal scroll issue on the property details page caused by carousel controls.

### Removed
- **"View All Photos" Button**: Removed the explicit "View all photos" button from the property image gallery, relying on intuitive image clicks to open the lightbox.
- **Wishlist Feature**: Completely removed the wishlist feature to resolve persistent permission errors and simplify the codebase.
- **Sold Properties Page**: Deleted the "Sold Properties" page and all links pointing to it.
- **Duplicate Files**: Removed several duplicate component files that were causing build conflicts.
- **Header Links**: Removed "About Us" and "Contact Us" from the main header navigation to streamline the user experience.
- **`patch-package`**: Removed the `patch-package` dependency from `package.json` as it was not needed.

```