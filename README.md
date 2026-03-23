# Endless Path Backend — Setup & API Guide

## Prerequisites

- Node.js v18+
- MariaDB / MySQL running locally
- Cloudinary account (free at cloudinary.com)

## Setup Steps

### 1. Clone & Install

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` — use a long random string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### 3. Create Database

Login to MariaDB/MySQL and run:

```sql
CREATE DATABASE endless_path_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Run the Server

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

Tables are auto-created/updated on startup via `sequelize.sync({ alter: true })`.

---

## Folder Structure

```
backend/
├── src/
│   ├── config/           # DB, Cloudinary, env config
│   ├── middlewares/       # auth, validate, error handler
│   ├── models/            # Sequelize models + associations
│   ├── utils/             # JWT helpers, AppError, cloudinary upload
│   └── modules/
│       ├── auth/          # register, login, me
│       ├── services/      # service listings
│       ├── provider/      # provider profile, availability
│       ├── booking/       # bookings with auto-assignment
│       ├── reviews/       # ratings & reviews
│       └── admin/         # admin dashboard APIs
├── .env.example
├── tsconfig.json
└── package.json
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register (name, phone, password, role) |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get own profile |

### Services
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/services` | ❌ | List all services (`?category=Plumbing`) |
| GET | `/api/services/:id` | ❌ | Get service detail |
| POST | `/api/services` | Admin | Create service (with optional image) |

### Providers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/providers/register` | Provider | Register provider profile |
| GET | `/api/providers/me` | Provider | Own provider profile |
| PATCH | `/api/providers/toggle-availability` | Provider | Go online/offline |
| GET | `/api/providers/:id` | ✅ | View any provider's profile |

### Bookings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings` | Customer | Create booking (auto-assigns provider) |
| GET | `/api/bookings/my` | Customer | Customer's own bookings |
| GET | `/api/bookings/jobs` | Provider | Provider's assigned jobs |
| GET | `/api/bookings/:id` | ✅ | Booking detail |
| PATCH | `/api/bookings/:id/status` | ✅ | Update status |

### Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reviews` | Customer | Rate a completed booking |
| GET | `/api/reviews/provider/:id` | ❌ | All reviews for a provider |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | All users |
| GET | `/api/admin/bookings` | Admin | All bookings |
| GET | `/api/admin/providers` | Admin | All providers |
| PATCH | `/api/admin/providers/:id/approve` | Admin | Approve a provider |

---

## Authentication

Send JWT in every protected request header:

```
Authorization: Bearer <your_token_here>
```

## Image Upload

For endpoints that accept images, send as `multipart/form-data` with field name `image`.
