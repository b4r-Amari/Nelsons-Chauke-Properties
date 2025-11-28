# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Multi-Select Autocomplete Filter**: Implemented an advanced "Multi-Select Autocomplete Search Input with Chips" for location filtering, allowing users to search for and select multiple suburbs simultaneously.
- **Automatic Scrolling**: The property listings page now automatically scrolls down to the results when a search is initiated from the homepage, creating a smoother user experience.

### Changed
- **Property Filter Redesign**:
    - Overhauled the property filter to a modern, full-width layout inspired by Property24.
    - Removed "Developments" and "Sold Prices" tabs to simplify the interface.
    - Increased the font size and weight of the "Buy", "Rent", and "Agents" tabs to make them more prominent.
    - Set the active tab's underline color to the primary brand color for better visual feedback.
- **Property Listings Page**:
    - Removed the large header image to reduce clutter and focus on search results.
    - Repositioned the property filter to "float" between the hero image and the results, preventing layout shifts when advanced filters are opened.
- **Mobile Responsiveness**:
    - Adjusted the mobile header icon size for better usability.
    - Fixed a layout shift issue caused by the mobile menu opening.
    - Resolved a horizontal scroll issue on the property details page caused by carousel controls.
    - Made admin dashboard "Quick Actions" cards stack vertically on smaller screens.
    - Hid less critical columns on admin tables ("Manage Agents", "Manage Blog Posts") to prevent horizontal scrolling on mobile devices.

### Fixed
- **Build & Runtime Errors**: 
    - Resolved a "Module not found" build error by correcting an invalid component import path.
    - Fixed a runtime error where `CollapsibleTrigger` was used outside a `Collapsible` component in the property filter.
- **Infinite Loop**: Corrected a "Maximum update depth exceeded" error caused by a circular dependency between the `PropertyListings` and `PropertyFilter` components.
- **UI Bugs**: Removed a duplicate close button from the mobile sidebar menu.

### Removed
- **Wishlist Feature**: Completely removed the wishlist feature to resolve persistent permission errors and simplify the codebase.
- **Sold Properties Page**: Deleted the "Sold Properties" page and all links pointing to it.
- **Duplicate Files**: Removed several duplicate component files that were causing build conflicts.
- **Header Links**: Removed "About Us" and "Contact Us" from the main header navigation to streamline the user experience.
- **`patch-package`**: Removed the `patch-package` dependency from `package.json` as it was not needed.
