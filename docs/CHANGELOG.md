# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **Project Changelog**: This document was created to maintain a persistent history of user requests and AI-driven changes, ensuring context is not lost between interactions.

### Changed
- **Architectural Shift: Reverted to Client-Side Data Fetching**: Due to persistent server-side authentication errors (`Could not refresh access token`), all data fetching was moved from the server to the client. This ensures the application is functional and can reliably connect to Firestore.
  - All data fetching now occurs within components using `useEffect` hooks and the client-side `firebase` SDK.
  - The `firebase-admin` and `@google-cloud/firestore` packages were removed to resolve the build-time and runtime authentication conflicts.
  - The server-side data fetching logic in `src/lib/data.ts` and related files was replaced with client-side implementations.

### Fixed
- **Persistent Data Fetching Errors**: Resolved a series of `Could not refresh access token` and `Module not found: Can't resolve 'net'` errors by moving all data fetching to the client-side, which eliminated the server-side authentication problem.
