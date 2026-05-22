# Database

Travel Sphere uses one PostgreSQL database for every portal.

The shared schema lives in:

```text
Database/prisma/schema.prisma
```

The database stores:

- users
- roles
- packages
- bookings
- payments
- enquiries
- reviews
- agents
- agent assignments

Do not create separate databases for customer, agent, and admin portals unless the product requirements change significantly.
