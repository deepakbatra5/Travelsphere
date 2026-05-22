# Single Backend API

This folder is the single shared backend for all Travel Sphere portals.

Used by:

- Customer website
- Agent portal
- Admin panel

Keep shared business logic here instead of creating separate customer, agent, and admin backends.

Main responsibilities:

- Authentication callbacks
- Packages
- Bookings
- Payments
- Enquiries
- Reviews
- Agent actions
- Admin actions

Database access goes through the shared Prisma client in `Backend/lib/db.ts`.
