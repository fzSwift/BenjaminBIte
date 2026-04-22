# Benjamin Bite

Benjamin Bite is a full-stack canteen ordering platform for students and staff. It provides secure authentication, menu management, cart and checkout, order tracking, and a loyalty points system with tiering and redemption.

## Tech Stack

- Frontend: `React`, `TypeScript`, `React Router`, `Axios`, `Bootstrap`
- Backend: `Node.js`, `Express`, `TypeScript`, `MongoDB`, `Mongoose`
- Auth & Security: `JWT`, `bcryptjs`, role-based access middleware
- Storage: Supabase Storage (for menu image upload/remove)

## Core Features

- User and admin registration/login with JWT authentication
- Admin-only menu management (create/update/take-down items)
- Cart flow (add, update quantity, remove, checkout)
- Order history and admin order management
- Loyalty system:
  - earn points on orders
  - expiry handling
  - Silver / Gold / Platinum tiers
  - redeem points once per order
- Offline demo fallback:
  - API can return built-in menu data when MongoDB is unavailable
  - offline banner displayed on frontend menu page

## Repository Structure

```text
BenjaminBite/
  backend/
    src/
      config/
      controllers/
      data/
      middleware/
      models/
      routes/
      scripts/
      services/
      types/
      server.ts
    .env.example
    package.json
    tsconfig.json
  frontend/
    public/
      menu/
      logo.png
    src/
      assets/
      components/
      pages/
      services/
      App.tsx
      main.tsx
      styles.css
      types.ts
    .env.example
    package.json
    tsconfig.json
    tsconfig.app.json
    vite.config.ts
    index.html
  README.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB (local or cloud URI)

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and configure:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_SECRET_KEY`
- `FRONTEND_URL`

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` and configure:

- `VITE_API_URL` (example: `http://localhost:5000/api`)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_BUCKET` (example: `menu-images`)

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Development Run

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

Frontend URL: `http://localhost:5173`

## Production Build Check

Run both builds before pushing/deploying:

```bash
cd backend
npm run build

cd ../frontend
npm run build
```

## Available Scripts

### Backend scripts

- `npm run dev` - start backend in dev mode
- `npm run build` - compile backend TypeScript
- `npm run start` - run compiled backend
- `npm run seed:menu` - seed MongoDB with sample menu entries
- `npm run generate:default-menu` - regenerate `backend/src/data/defaultMenuItems.ts` from `frontend/public/menu`

### Frontend scripts

- `npm run dev` - start Vite dev server
- `npm run build` - build production bundle
- `npm run preview` - preview production build

## API Overview

### Auth and User

- `POST /api/user/register`
- `POST /api/user/login`
- `GET /api/user/profile/:id`
- `PUT /api/user/update`
- `GET /api/user/:userId/points`

### Menu

- `GET /api/menu`
- `GET /api/menu/search`
- `POST /api/menu` (admin only)
- `PUT /api/menu/:id` (admin only)

### Cart

- `POST /api/cart`
- `GET /api/cart`
- `PUT /api/cart/:menuItemId`
- `DELETE /api/cart/:menuItemId`
- `POST /api/cart/checkout`

### Orders

- `POST /api/orders`
- `GET /api/orders/:userId`
- `GET /api/orders/admin` (admin only)
- `PUT /api/orders/:orderId/status` (admin only)
- `POST /api/orders/:orderId/redeem`
- `GET /api/orders/admin/search` (admin only)
- `GET /api/orders/admin/filter` (admin only)
- `GET /api/orders/admin/:orderId/history` (admin only)

## Admin Account Flow

To register an admin account:

1. Go to Register page.
2. Select role `admin`.
3. Provide the exact `ADMIN_SECRET_KEY` from backend `.env`.
4. Submit and log in normally.

If the key is invalid, admin registration is rejected.

## Supabase Storage Setup (Menu Images)

1. Create a Supabase project.
2. Open Storage and create a bucket (for example `menu-images`).
3. Set frontend env values:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_BUCKET`
4. Use Admin Menu Management page to:
   - upload image
   - remove image
   - take down an item from public menu

## Offline Demo Mode

When MongoDB is unavailable:

- backend still starts
- `/api/menu` and `/api/menu/search` return fallback meals from `defaultMenuItems.ts`
- frontend displays an offline demo banner on the menu page

Fallback menu items are generated from local images in `frontend/public/menu` using:

```bash
cd backend
npm run generate:default-menu
```

## Quality and Security Notes

- Passwords are hashed with `bcryptjs`
- JWT token auth is enforced with middleware
- Admin-only routes are protected by role checks
- Cart totals are computed using menu prices from backend data
- Loyalty expiry and redemption guards are enforced server-side

## Deployment Guide

### Option A: Render (Backend) + Vercel/Netlify (Frontend)

#### 1) Deploy backend (Render or Railway)

- Root directory: `backend`
- Build command: `npm install && npm run build`
- Start command: `npm run start`
- Required environment variables:
  - `PORT`
  - `MONGO_URI`
  - `JWT_SECRET`
  - `ADMIN_SECRET_KEY`
  - `FRONTEND_URL` (set to your deployed frontend URL)

#### 2) Deploy frontend (Vercel or Netlify)

- Root directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Required environment variables:
  - `VITE_API_URL` (set to deployed backend URL + `/api`)
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_SUPABASE_BUCKET`

#### 3) Post-deploy checks

- Register/login works
- Menu loads and images render
- Cart checkout creates orders
- Loyalty points update and redemption works
- Admin pages require admin role

## Git Push Checklist

```bash
# Run from project root
git init
git add .
git commit -m "Initial release: Benjamin Bite full-stack app"

# Add remote and push
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```
