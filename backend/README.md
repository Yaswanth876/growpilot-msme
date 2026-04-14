# GrowPilot Backend Setup with Supabase

## 📋 Prerequisites

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **Supabase Account** - [Free at supabase.com](https://supabase.com)

---

## 🚀 Step-by-Step Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Sign In"** and create a free account
3. Click **"New Project"**
4. Fill in:
   - **Project Name**: `growpilot`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., `us-east-1`)
5. Click **"Create new project"** (takes ~2 minutes)

### Step 2: Get Your Credentials

Once the project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_KEY` ⚠️ (Keep this safe!)

### Step 3: Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Paste the SQL from [sql/create-tables.sql](./sql/create-tables.sql)
4. Click **"Run"** (or Cmd+Enter)
5. Tables will be created!

### Step 4: Setup Backend

1. **Install dependencies:**
   ```powershell
   cd backend
   npm install
   ```

2. **Create `.env` file** from `.env.example`:
   ```powershell
   Copy-Item .env.example .env
   ```

3. **Edit `.env`** and paste your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_KEY=eyJhbGc...
   PORT=5000
   JWT_SECRET=your-super-secret-key-12345
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the backend:**
   ```powershell
   npm run dev
   ```

   You should see:
   ```
   ✅ Supabase connected: https://your-project.supabase.co
   🚀 Server running on http://localhost:5000
   ```

---

## 🧪 Test the Backend

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Create a Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Rice 10kg","category":"Groceries","price":450,"stock":5}'
```

---

## 📁 Backend Structure

```
backend/
├── server.js              # Main Express server
├── config/
│   └── supabase.js        # Supabase client setup
├── routes/
│   ├── products.js        # Product CRUD endpoints
│   ├── orders.js          # Order management
│   ├── expenses.js        # Expense tracking
│   └── users.js           # Auth & user management
├── package.json
├── .env                   # Your secrets (git-ignored)
├── .env.example           # Template for .env
└── README.md              # This file
```

---

## 🔗 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Users (Auth)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users (admin)
- `GET /api/users/me` - Get current user

---

## ❌ Troubleshooting

### "SUPABASE_URL not provided"
- Make sure `.env` file exists with `SUPABASE_URL` set
- Restart the server after updating `.env`

### "Tables don't exist"
- Make sure you ran the SQL migration in the Supabase SQL Editor
- Check the **Tables** section in Supabase dashboard

### "Port 5000 already in use"
- Change PORT in `.env` file or kill the process using that port:
  ```powershell
  Get-Process -Name node | Stop-Process
  ```

### "CORS error from frontend"
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL (usually `http://localhost:5173`)

---

## 🔐 Security Notes

⚠️ **NEVER commit `.env` to Git!** It contains secrets.

- `.env` is already in `.gitignore` (protected)
- Use a `.env` template file (`.env.example`) in Git
- In production, use environment variables from your hosting platform

---

## 🌐 Next Steps

1. Install backend dependencies: `npm install`
2. Create Supabase project and tables
3. Setup `.env` file with your credentials
4. Start backend: `npm run dev`
5. Connect your React frontend to these API endpoints
6. Test with `curl` commands above

---

Created for GrowPilot MSME Platform | April 2026
