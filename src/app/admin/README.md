# Admin Frontend

This folder contains the admin management panel.

Admin routes include:

- `/admin`
- `/admin/packages`
- `/admin/bookings`
- `/admin/enquiries`
- `/admin/agents`
- `/admin/customers`

Production entrance:

```text
https://admin.travelsphere.sbs
```

The proxy maps clean subdomain routes like `/dashboard`, `/packages`, `/bookings`, and `/enquiries` to the internal `/admin/*` routes.

The admin panel uses the shared backend in `app/api` and the shared PostgreSQL database through Prisma.
