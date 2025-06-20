# 🔐 Role-Based Access Control API Example

A simple yet realistic RBAC system using JWT, SQLite, and Express. Built to demonstrate permission-based access in REST APIs — ideal for learning and extending in real-world projects.

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
