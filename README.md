# GroceryBox Delivery

Next.js delivery partner portal for the GroceryBox stack. Structure and foundations mirror [grocerybox-merchant](../grocerybox-merchant).

## Overview

- **Backend:** Go REST API (`NEXT_PUBLIC_API_BASE_URL`)
- **Auth:** Phone + password via `POST /api/v1/delivery/auth/login` (merchant-created delivery boys)
- **Client:** Axios + TanStack Query + Zustand

This repo includes login (phone + password session cookie), a protected dashboard shell, and API wiring for future delivery order routes.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` to the Go API (no trailing slash). The backend must define `SUPER_ADMIN_JWT_SECRET` or `DELIVERY_PARTNER_JWT_SECRET` so login can issue the `delivery_partner_session` cookie.

Delivery partners are created by merchants at **Dashboard → Delivery boys** (`POST /api/v1/merchant/delivery-boys` with `phone` and `password`, minimum 8 characters). They sign in here with that phone and password.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |# grocerybox-delivery
