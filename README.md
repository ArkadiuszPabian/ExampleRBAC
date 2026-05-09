# 🔐 Role-Based Access Control API Example

A simple yet realistic RBAC system using JWT, SQLite, and Express. Built to demonstrate permission-based access in REST APIs — ideal for learning and extending in real-world projects.

## 🚀 Getting Started

### 🧑‍💻 Local development

```bash
npm install
npm start
```

Frontend on `http://localhost:4200`, backend on `http://localhost:3000`. The dev backend reads `.env`; if missing, it falls back to the committed `.env.example`. Copy and edit when you need different secrets:

```bash
cp .env.example .env
```

The DB starts empty (probes hit `/api/healthz`). To seed dev users/roles the same way the chart does, set `SEED_DATA_PATH` to a JSON file matching the schema in `charts/example-rbac/values.yaml` under `seed.data`.

### 🐳 Container images

Pre-built images are published to GHCR on every release:

- `ghcr.io/arkadiuszpabian/rbac-backend:<version>`
- `ghcr.io/arkadiuszpabian/rbac-frontend:<version>`

Build them locally if you're iterating without pushing a tag:

```bash
docker build -f packages/backend/Dockerfile  -t rbac-backend  .
docker build -f packages/frontend/Dockerfile -t rbac-frontend .
```

Both Dockerfiles use the repo root as build context (workspaces). The frontend image bundles its built assets with nginx in a single immutable image.

### ☸️ Kubernetes (Helm)

The chart at `charts/example-rbac/` deploys both services behind Gateway API with TLS terminated at the gateway by cert-manager. It supports a real cluster (kind/minikube or production) out of the box.

#### Install from the published Helm repo

The chart is published to GitHub Pages every time release-please cuts a new tag (see [Release flow](#-release-flow) below). The chart's default `image.repository` already points at the matching GHCR images, so a fresh install needs nothing but secrets:

```bash
helm repo add example-rbac https://arkadiuszpabian.github.io/ExampleRBAC/
helm repo update
helm install rbac example-rbac/example-rbac \
  --set secrets.accessTokenSecret=$(openssl rand -hex 32) \
  --set secrets.refreshTokenSecret=$(openssl rand -hex 32)
```

(Or install directly from the working tree with `helm install rbac charts/example-rbac …` while developing.)

#### Cluster prerequisites (one-time per cluster)

```bash
# 1. Gateway API CRDs
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.2.0/standard-install.yaml

# 2. NGINX Gateway Fabric (provides the "nginx" GatewayClass the chart targets)
helm install ngf oci://ghcr.io/nginxinc/charts/nginx-gateway-fabric \
  --namespace nginx-gateway --create-namespace

# 3. cert-manager (issues the gateway TLS cert)
helm repo add jetstack https://charts.jetstack.io && helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true
```

For istio / kgateway / contour, install your preferred controller and override `--set gateway.className=…`.

#### Local cluster, self-signed cert on `localhost`

```bash
helm install rbac charts/example-rbac \
  --set secrets.accessTokenSecret=$(openssl rand -hex 32) \
  --set secrets.refreshTokenSecret=$(openssl rand -hex 32)
```

Leaving `hostname` empty makes the chart provision its own self-signed `Issuer` and route to `localhost`. Forward the gateway port and open `https://localhost`.

#### Real cluster, public hostname

```bash
helm install rbac example-rbac/example-rbac \
  --set hostname=rbac.example.com \
  --set certManager.issuer.name=letsencrypt-prod \
  --set secrets.accessTokenSecret=$(openssl rand -hex 32) \
  --set secrets.refreshTokenSecret=$(openssl rand -hex 32) \
  --set db.persistence.enabled=true
```

This expects a `ClusterIssuer` named `letsencrypt-prod` already in the cluster (a one-liner — see [cert-manager ACME docs](https://cert-manager.io/docs/configuration/acme/)).

## 🔁 Release flow

Releases are tag-driven and fully automated. Single version line covers the chart, both Docker images, and the git tag.

```
conventional commit on dev
        │
        ▼
release-please bot (.github/workflows/release.yml)
   opens / updates a "Release v0.X.Y" PR
        │  (maintainer reviews + merges)
        ▼
release-please creates tag v0.X.Y + GitHub Release
        │
        ▼
publish workflow (.github/workflows/publish.yml)
   ├── builds & pushes ghcr.io/<owner>/rbac-{backend,frontend}:0.X.Y (and :latest)
   └── chart-releaser publishes example-rbac-0.X.Y.tgz to GitHub Pages
```

Practical implications:

- **Commit messages drive versioning.** `feat:` → minor bump, `fix:` → patch, `feat!:` / `BREAKING CHANGE:` → major. release-please updates the root `CHANGELOG.md`, root `package.json`, **and** `charts/example-rbac/Chart.yaml` (`version` + `appVersion`) in the same Release PR.
- **The chart version always matches the image tags it points to** — no drift, no "the chart says 0.2.0 but the image was rebuilt last week."
- **First-time repo setup** (one-time, GitHub UI). Without these, the Pages URL serves this README from the default branch instead of the chart repo:
  - Settings → Pages → Source: *Deploy from a branch* → Branch `gh-pages` / `(root)`. The branch is created on the first publish run (the workflow seeds it with `index.html` + `.nojekyll` alongside the chart `index.yaml`).
  - Settings → Actions → General → Workflow permissions: *Read and write*.
  - After the first publish, open the GHCR packages (Profile → Packages → `rbac-backend` / `rbac-frontend`) and flip visibility to **Public** so anonymous Kubernetes pulls work.

**Useful toggles** (see `charts/example-rbac/values.yaml` for the full set):

| Value                        | Default | Purpose                                                    |
| ---------------------------- | ------- | ---------------------------------------------------------- |
| `hostname`                   | `""`    | Empty → `localhost` + self-signed; set → real cert         |
| `gateway.enabled`            | `true`  | Gateway API mode (requires a Gateway controller)           |
| `ingress.enabled`            | `false` | Use Ingress instead (mutually exclusive with `gateway`)    |
| `gateway.className`          | `nginx` | Override for istio / kgateway / etc.                       |
| `db.persistence.enabled`     | `false` | `false` = in-memory SQLite; `true` = PVC-backed file       |
| `seed.enabled` / `seed.data` | `true`  | Initial roles, permissions, users, articles                |
| `*.autoscaling.enabled`      | `false` | HPA per service                                            |

Seed data lives in `values.yaml` and is mounted into the backend as a JSON file; it's only applied on a fresh DB.

## ✅ Authentication

- POST `/login` – returns a JWT token
- No `/logout` endpoint — logout is handled by deleting the token from cookies or storage
- All protected routes require a valid JWT with the correct permissions

**JWT Payload**
Sent as a Bearer token in requests. Includes standard claims and one custom role field.

```json
{
  "sub": 1, // user ID
  "iat": 1718123456, // issued at timestamp
  "name": "alice", // optional, for UI display
  "role": "admin" // user role (custom claim)
}
```

## 📄 Articles API

| Method | Route           | Permission Required |
| ------ | --------------- | ------------------- |
| POST   | `/articles`     | `create:articles`   |
| PUT    | `/articles/:id` | `update:articles`   |
| DELETE | `/articles/:id` | `delete:articles`   |

> Users with `create:articles` or `update:articles` permissions can publish or unpublish articles.

## 👤 User API

| Method | Route        | Permission Required |
| ------ | ------------ | ------------------- |
| GET    | `/users`     | `view:users`        |
| POST   | `/users`     | `create:users`      |
| PUT    | `/users/:id` | `update:users`      |
| DELETE | `/users/:id` | `delete:users`      |

## 👥 Roles and Permissions

**Predefined roles:**

| Role          | Article Access       | User Access     |
| ------------- | -------------------- | --------------- |
| **User**      | View articles only   | ❌ none         |
| **Moderator** | Full articles access | ❌ none         |
| **Admin**     | Full access to all   | ✅ full control |

> If a user has the `view:users` permission, they’re allowed to access the admin panel UI.

## 🗃️ Database Schema

Using SQLite with the following relationships:

- Users → Role: one-to-many
- Users → Articles: one-to-many
- Roles ↔ Permissions: many-to-many

**Tables:**

- Users
- Articles
- Roles
- Permissions
- RolePermissions (join table)

**Article model:**

| Constraint | Field Name  | Field Type | Is Optional | Comment                      |
| ---------- | ----------- | ---------- | ----------- | ---------------------------- |
| PK         | id          | INTEGER    | No          | Auto-incremented primary key |
| –          | title       | TEXT       | No          |                              |
| –          | content     | TEXT       | Yes         | Can be empty or null         |
| –          | isPublished | BOOLEAN    | No          | Default `false`              |
| FK         | authorId    | INTEGER    | No          | References `Users.id`        |

**User model:**

| Constraint | Field Name     | Field Type | Is Optional | Comment                       |
| ---------- | -------------- | ---------- | ----------- | ----------------------------- |
| PK         | id             | INTEGER    | No          | Auto-incremented primary key  |
| –          | username       | TEXT       | No          | Unique constraint recommended |
| –          | hashedPassword | TEXT       | No          | Stored securely               |
| FK         | roleId         | INTEGER    | No          | References `Roles.id`         |
| –          | isActivated    | BOOLEAN    | No          | Determines login eligibility  |

**Role model:**

| Constraint | Field Name | Field Type | Is Optional | Comment                      |
| ---------- | ---------- | ---------- | ----------- | ---------------------------- |
| PK         | id         | INTEGER    | No          | Auto-incremented primary key |
| –          | roleName   | TEXT       | No          | e.g., `admin`, `moderator`   |

**Permission model:**

| Constraint | Field Name     | Field Type | Is Optional | Comment                                      |
| ---------- | -------------- | ---------- | ----------- | -------------------------------------------- |
| PK         | id             | INTEGER    | No          | Auto-incremented primary key                 |
| –          | permissionName | TEXT       | No          | Format: `action:resource`, e.g. `view:users` |

**RolePermissions model:**

| Constraint | Field Name   | Field Type | Is Optional | Comment                          |
| ---------- | ------------ | ---------- | ----------- | -------------------------------- |
| FK         | roleId       | INTEGER    | No          | References `Roles.id`            |
| FK         | permissionId | INTEGER    | No          | References `Permissions.id`      |
| –          |              |            |             | Composite PK recommended on both |

## 🛡️ Access Control Logic

- Backend checks permissions based on JWT + DB at each request
- Frontend also checks permissions (e.g. hiding buttons, routes)
- Middleware like requirePermission("update:articles") is used for clean, declarative route protection

## 📦 Stack

### 🛠️ Backend:

- **Node.js + Express**
  Lightweight and performant server setup for building RESTful APIs with clear route handling and middleware support.

- **Sequelize (with SQLite)**
  Sequelize ORM handles model definitions and relationships with ease. Using SQLite for simplicity and portability — ideal for learning, prototyping, and small apps.

- **jsonwebtoken**
  JWT-based authentication with stateless access control. Tokens include custom claims (like user role) and are verified on every protected request.

### 🌐 Frontend

- **Angular**
  Modern SPA framework used for building the UI, with route guards and permission-based component rendering based on the JWT token.
  The frontend:
  - Parses the JWT for UI-level decisions (e.g. show/hide buttons)
  - Sends the token in Authorization headers for authenticated requests
  - Mirrors backend permissions to avoid exposing unauthorized functionality
