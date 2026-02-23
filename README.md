# Kodbank

Full-stack banking app with user registration, JWT-based login, and balance check.

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your AIVEN DB credentials (DB_URL or DB_HOST/DB_NAME/DB_USERNAME/DB_PASSWORD)
npm run init-db
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Environment (backend/.env)

- `DB_URL` - AIVEN PostgreSQL full connection string (e.g. `postgresql://user:pass@host:port/db?sslmode=require`)
- Or use: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DB_SSL=true`
- `JWT_SECRET` - Strong random secret (min 32 chars)
- `FRONTEND_URL` - Frontend origin for CORS (default: http://localhost:5173)

## Flow

1. **Register** at `/register` → redirects to `/login`
2. **Login** at `/login` with username/password → JWT stored in HttpOnly cookie and `cjwt` table → redirects to `/userdashboard`
3. **Dashboard** - Click "Check Balance" → JWT verified → balance fetched from `kodusers` → displayed with confetti animation
4. **Logout** - Clears cookie and invalidates token in DB

## API

- `GET /api/health` - Health check (DB connectivity)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT in cookie)
- `GET /api/auth/verify` - Verify token (for protected route check)
- `POST /api/auth/logout` - Logout (invalidates token)
- `GET /api/balance` - Get balance (requires auth cookie)
