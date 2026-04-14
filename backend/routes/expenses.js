import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// ─── GET all expenses ─────────────────────────────
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// ─── GET single expense ───────────────────────────
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  res.json(data);
});

// ─── CREATE expense ───────────────────────────────
router.post('/', async (req, res) => {
  const { category, amount, description, payment_method, vendor, invoice_number, status } = req.body;

  if (!category || amount === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        category,
        amount,
        description,
        payment_method: payment_method || 'cash',
        vendor,
        invoice_number,
        status: status || 'approved',
      },
    ])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

// ─── UPDATE expense ───────────────────────────────
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(req.body)
    .eq('id', req.params.id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  res.json(data[0]);
});

// ─── DELETE expense ───────────────────────────────
router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', req.params.id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  res.json({ message: 'Expense deleted', expense: data[0] });
});

// ─── GET expenses by category ──────────────────────
router.get('/category/:category', async (req, res) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('category', req.params.category);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

export default router;
