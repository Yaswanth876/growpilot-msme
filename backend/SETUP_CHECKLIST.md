# ✅ GrowPilot Supabase Setup Checklist

Follow this step-by-step to get your backend running!

---

## 📋 Phase 1: Create Supabase Project (5 minutes)

- [ ] Go to https://supabase.com
- [ ] Click **"Sign Up"** and create a free account
- [ ] Click **"New Project"**
- [ ] Enter:
  - Project Name: `growpilot`
  - Database Password: (create & save strong password)
  - Region: (pick closest to you)
- [ ] Wait for project to load (~2 minutes)

---

## 🔑 Phase 2: Get Your Credentials (2 minutes)

- [ ] In Supabase, click **Settings** → **API**
- [ ] Copy **Project URL** 
  - Save to: `SUPABASE_URL`
  - Example: `https://xyz123.supabase.co`
- [ ] Copy **Anon public** key
  - Save to: `SUPABASE_ANON_KEY`
- [ ] Copy **Service role secret** key
  - Save to: `SUPABASE_SERVICE_KEY` ⚠️ **KEEP THIS SECRET!**

---

## 🗄️ Phase 3: Create Database Tables (3 minutes)

- [ ] In Supabase, go to **SQL Editor** (left sidebar)
- [ ] Click **"New Query"**
- [ ] Copy-paste entire content from: `backend/sql/create-tables.sql`
- [ ] Click **"Run"** (or Cmd+Enter)
- [ ] Wait for success message ✅
- [ ] Verify: Click **"Tables"** in sidebar and see all 4 tables created

---

## 🚀 Phase 4: Run Backend (5 minutes)

- [ ] Open PowerShell
- [ ] Navigate to backend folder:
  ```powershell
  cd d:\growpilot-msme\backend
  ```
- [ ] Create `.env` file from template:
  ```powershell
  Copy-Item .env.example .env
  ```
- [ ] Edit `.env` with your Supabase credentials:
  ```env
  SUPABASE_URL=https://xyz123.supabase.co
  SUPABASE_ANON_KEY=eyJhb...
  SUPABASE_SERVICE_KEY=eyJhb...
  PORT=5000
  JWT_SECRET=your-super-secret-password-12345
  FRONTEND_URL=http://localhost:5173
  ```
- [ ] Install dependencies:
  ```powershell
  npm install
  ```
- [ ] Start the server:
  ```powershell
  npm run dev
  ```
- [ ] Verify you see:
  ```
  ✅ Supabase connected: https://xyz123.supabase.co
  🚀 Server running on http://localhost:5000
  ```

---

## 🧪 Phase 5: Test Backend (2 minutes)

Run these commands to verify everything works:

### Health Check
```powershell
curl http://localhost:5000/api/health
```
**Expected response:**
```json
{
  "status": "Backend is running ✓",
  "database": "Supabase (PostgreSQL)",
  "timestamp": "2026-04-14T10:00:00.000Z"
}
```

### Get All Products
```powershell
curl http://localhost:5000/api/products
```
**Expected response:** Array of 6 sample products

### Create New Product
```powershell
curl -X POST http://localhost:5000/api/products `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Wheat 10kg",
    "category": "Groceries",
    "price": 450,
    "stock": 5
  }'
```

---

## 📊 What Gets Created

After running the SQL migration, you'll have:

| Table | Rows | Purpose |
|-------|------|---------|
| `products` | 6 | Inventory of items for sale |
| `orders` | 0 | Customer orders |
| `expenses` | 5 | Business expenses |
| `users` | 0 | System users & auth |

---

## ✨ Your Backend URLs

Once running, use these to connect your frontend:

```javascript
// In your React frontend
const API_URL = 'http://localhost:5000/api';

// Examples:
fetch(`${API_URL}/products`)
fetch(`${API_URL}/orders`, { method: 'POST', body: JSON.stringify(...) })
fetch(`${API_URL}/users/login`, { method: 'POST', body: ... })
```

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| **"SUPABASE_URL not provided"** | Check `.env` file exists and has `SUPABASE_URL` set |
| **Tables don't show in Supabase** | Go to SQL Editor and re-run the `create-tables.sql` |
| **"Port 5000 already in use"** | Change `PORT=5001` in `.env` or close other apps |
| **401 auth errors** | Check `SUPABASE_SERVICE_KEY` in `.env` is correct |
| **CORS errors from frontend** | Make sure `FRONTEND_URL` in `.env` matches your frontend URL |

---

## 🎯 Next Steps (After Backend Running)

1. ✅ Backend running on `http://localhost:5000`
2. ⏭️ Connect React frontend to API endpoints
3. ⏭️ Add login/registration pages
4. ⏭️ Replace mock data with API calls
5. ⏭️ Deploy to production

---

## 🤔 Need Help?

- Check backend logs for errors (PowerShell shows them)
- Visit https://supabase.com/docs for Supabase docs
- Test endpoints with `curl` commands above
- Verify `.env` file is in `backend/` folder (not `backend/backend/`)

---

**Status:** ✅ Backend created and ready for setup!
