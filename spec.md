# Specification

## Summary
**Goal:** Add a visible "Admin Panel" navigation link in the app layout that is conditionally shown only to admin users.

**Planned changes:**
- In `Layout.tsx`, add an "Admin Panel" navigation link that routes to `/admin`, rendered only when the current user is an admin (using the existing admin-check hook)
- Ensure the link appears in both the desktop navigation bar and the mobile menu
- Non-admin and unauthenticated users do not see the link

**User-visible outcome:** Admin users will see an "Admin Panel" link directly in the navigation header (desktop and mobile), allowing them to navigate to the admin panel without any extra steps.
