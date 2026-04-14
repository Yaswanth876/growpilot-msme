import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// ─── GET all products ─────────────────────────────
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// ─── GET single product ───────────────────────────
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(data);
});

// ─── CREATE product ───────────────────────────────
router.post('/', async (req, res) => {
  const { name, category, price, stock, min_stock, description, sku } = req.body;

  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        name,
        category: category || 'Other',
        price,
        stock,
        min_stock: min_stock || 5,
        description,
        sku,
        status: stock >= (min_stock || 5) ? 'good' : stock > 0 ? 'low' : 'critical',
      },
    ])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

// ─── UPDATE product ───────────────────────────────
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .update(req.body)
    .eq('id', req.params.id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(data[0]);
});

// ─── DELETE product ───────────────────────────────
router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', req.params.id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ message: 'Product deleted', product: data[0] });
});

// ─── Search products ──────────────────────────────
router.get('/search/query', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query required' });
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${q}%,category.ilike.%${q}%`);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

export default router;
