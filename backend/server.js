import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import dotenv from 'dotenv';

// Routes
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import expenseRoutes from './routes/expenses.js';
import userRoutes from './routes/users.js';

// Supabase client initialization
import './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running ✓', 
    database: 'Supabase (PostgreSQL)',
    timestamp: new Date().toISOString() 
  });
});

// ─── Routes ───────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/users', userRoutes);

// ─── Error Handling ───────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── 404 Handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Start Server ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:5173`);
  console.log(`🔗 API Health: http://localhost:${PORT}/api/health\n`);
});
