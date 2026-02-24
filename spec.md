# Specification

## Summary
**Goal:** Fix the admin panel visibility and the locker access request flow so admins can see and manage requests, and members can submit and track their access status.

**Planned changes:**
- Show the "Admin Panel" navigation link in the header only for admin users after login, and hide it from non-admin users
- Ensure the admin page renders the `LockerAccessRequestsPanel` component listing all submitted access requests with principal ID, timestamp, and status
- Add Approve and Deny actions in the admin panel so admins can act on each request
- Fix backend persistence so submitted locker access requests are stored and retrievable by the admin
- Update `LockerAccessGate` to correctly check the authenticated user's approval status and display the appropriate UI state: login prompt, "Request Access" button, "Request Pending" message, "Access Denied" message, or locker content for approved users and admins

**User-visible outcome:** Admin users can log in, see the Admin Panel link, view all pending access requests, and approve or deny them. Members who request locker access see accurate status feedback, and approved members can access the locker content.
