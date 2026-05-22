# Deployment

Travel Sphere is designed for:

- One VPS
- One public IP
- One Next.js app process
- One PostgreSQL database
- Three subdomains

Production domains:

```text
travelsphere.sbs
agent.travelsphere.sbs
admin.travelsphere.sbs
```

All domains point to the same server IP. `proxy.ts` decides which portal to show based on the host.

Use the detailed guide in:

```text
docs/subdomain-deployment.md
```
