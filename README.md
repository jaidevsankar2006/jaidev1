# Optimized Retail Inventory Management System

Full-stack final project starter for managing retail stock, suppliers, purchases, sales, and reorder suggestions.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Data store: MySQL

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
copy .env.example .env
npm run dev
```

## MySQL Setup

1. Create a MySQL database by importing [schema.sql](D:\optimized retail inventiry management system\backend\database\schema.sql)
2. Seed demo data from [seed.sql](D:\optimized retail inventiry management system\backend\database\seed.sql)
3. Update your backend `.env` with MySQL credentials

Example `.env` values:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=optimized_retail_inventory
```

## Run The Frontend

```bash
cd frontend
npm install
npm run dev
```

## Notes

- The backend now reads and writes directly to MySQL using `mysql2`.
- Demo accounts are seeded into MySQL through [seed.sql](D:\optimized retail inventiry management system\backend\database\seed.sql).
