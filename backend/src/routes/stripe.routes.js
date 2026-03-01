const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripe.controller');
const authMiddleware = require('../middleware/auth');

// Webhook route (must be before bodyParser for raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.handleWebhook);

// Protected routes
router.post('/create-checkout', authMiddleware, stripeController.createCheckoutSession);
router.get('/subscription', authMiddleware, stripeController.getSubscriptionStatus);
router.post('/cancel-subscription', authMiddleware, stripeController.cancelSubscription);

module.exports = router;
