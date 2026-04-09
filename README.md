# Optimized Retail Inventory Management System

Full-stack final project starter for managing retail stock, suppliers, purchases, sales, and reorder suggestions.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Data store: Local JSON file for demo use

## Features

- Demo login for admin and staff
- Product, category, and supplier management
- Purchase and sales entry with automatic stock updates
- Low-stock and excess-stock alerts
- Dashboard analytics
- Reorder suggestions based on recent sales trends

## Demo Accounts

- Admin: `admin@retailflow.com` / `Admin@123`
- Staff: `staff@retailflow.com` / `Staff@123`

## Run The Backend

```bash
cd backend
npm install
npm run dev
```

## Run The Frontend

```bash
cd frontend
npm install
npm run dev
```

## Notes

- The backend stores demo data in [backend/src/data/database.json](C:\Users\jaide\OneDrive\Documents\optimized retail inventiry management system\backend\src\data\database.json).
- The project is structured so you can later swap the JSON store with MongoDB without changing the frontend.
