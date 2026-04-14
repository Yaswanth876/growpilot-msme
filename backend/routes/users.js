import express from 'express';
import { supabase } from '../config/supabase.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ─── Generate JWT token ───────────────────────────
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
}

// ─── REGISTER user ────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, phone, business_name, business_address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        name,
        email,
        password: hashedPassword,
        phone,
        business_name,
        business_address,
        role: 'staff',
      },
    ])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const token = generateToken(data[0].id);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: data[0].id,
      name: data[0].name,
      email: data[0].email,
      role: data[0].role,
    },
  });
});

// ─── LOGIN user ───────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user.id);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      business_name: user.business_name,
    },
  });
});

// ─── GET all users (admin only) ────────────────────
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, phone, role, business_name, created_at');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// ─── GET current user ─────────────────────────────
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, business_name, created_at')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ─── UPDATE user ──────────────────────────────────
router.put('/:id', async (req, res) => {
  const { password, ...updateData } = req.body;

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', req.params.id)
    .select('id, name, email, phone, role, business_name');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(data[0]);
});

export default router;
