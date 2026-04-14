import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// ─── Generate unique order ID ─────────────────────
function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ─── GET all orders ───────────────────────────────
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// ─── GET single order ─────────────────────────────
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(data);
});

// ─── CREATE order ─────────────────────────────────
router.post('/', async (req, res) => {
  const { customer_name, customer_phone, items, total_amount, payment_method, notes } = req.body;

  if (!customer_name || !items || !total_amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        order_id: generateOrderId(),
        customer_name,
        customer_phone,
        items,
        total_amount,
        payment_method: payment_method || 'cash',
        notes,
        status: 'pending',
      },
    ])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

// ─── UPDATE order ─────────────────────────────────
router.put('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .update(req.body)
    .eq('id', req.params.id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(data[0]);
});

// ─── DELETE order ─────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .delete()
    .eq('id', req.params.id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({ message: 'Order deleted', order: data[0] });
});

// ─── Update order status ──────────────────────────
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status required' });
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', req.params.id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(data[0]);
});

export default router;
