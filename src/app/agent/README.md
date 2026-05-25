# Agent Frontend

This folder contains the agent portal.

Agent routes include:

- `/agent`
- `/profile`
- `/tours`
- `/my-tours`
- `/earning`
- `/help`

Production entrance:

```text
https://agent.travelsphere.sbs
```

The proxy maps clean subdomain routes like `/dashboard`, `/profile`, `/tours`, `/my-tours`, `/earning`, and `/help` to the internal `/agent/*` routes.

The agent portal uses the shared backend in `app/api` and the shared PostgreSQL database through Prisma.
