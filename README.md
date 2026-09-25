# auth_portal

Next.js frontend of the user management stack: log in, sign up, and assign yourself modules.
All data comes from the backend ([`linosteiner/user_mgmt_service`](https://github.com/linosteiner/user_mgmt_service));
deployed through the Ops repository ([`bernetlennard/user_mgmt_ops`](https://github.com/bernetlennard/user_mgmt_ops)).

## Pages

| Path | What |
|---|---|
| `/login`, `/signup` | log in / register |
| `/dashboard` | overview: your account and your modules |
| `/dashboard/modules` | every module the module_service offers; *Assign to me* assigns one |

## Route handlers (server side, in the frontend pod)

The jwt sits in an httpOnly cookie, so the browser cannot send it to the backend itself. These
handlers attach it and relay the backend's answer unchanged (status, body, `Retry-After`).
They live under `/auth`, because Traefik routes `/api` straight to the backend.

| Route | Backend call |
|---|---|
| `POST /auth/login`, `POST /auth/logout` | `POST /users/login`; sets / clears the cookie |
| `GET /auth/me` | `GET /users/me` |
| `GET /auth/modules` | `GET /modules` |
| `GET /auth/users/{userId}/modules` | `GET /users/{userId}/modules` |
| `PUT /auth/users/{userId}/modules/{moduleId}` | `PUT /users/{userId}/modules/{moduleId}` |

The module calls go on from the backend to the module_service. The page shows the backend's
answers as messages: 404 "not available", 503 "temporarily unavailable, try again in 15 seconds"
(module_service down or the backend's circuit breaker open).

## Local development

```bash
echo 'BACKEND_API_URL=http://localhost:8080/api' > .env.local
pnpm install
pnpm dev
```

## Deployment

A push to `main` runs `.github/workflows/deploy.yml`: build the image, push it as
`xxpirl2knc5/auth_portal:<commit-sha>`, write that tag into the Ops repo. ArgoCD rolls it out to
staging and prod. The image is the same for every environment; `BACKEND_API_URL` comes from the
frontend ConfigMap at runtime.
