const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const documentRoutes = require('./document.routes');
const stripeRoutes = require('./stripe.routes');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/stripe', stripeRoutes);

module.exports = router;
