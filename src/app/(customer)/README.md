# Customer Frontend

This folder contains the public customer website for Travel Sphere.

Customer routes include:

- `/`
- `/packages`
- `/packages/[slug]`
- `/search`
- `/customised-tour`
- `/help`
- `/contact`
- `/booking/[packageId]`
- `/dashboard`

Production entrance:

```text
https://travelsphere.sbs
```

The customer frontend uses the shared backend in `app/api` and the shared PostgreSQL database through Prisma.
