const stripeService = require('../services/stripe.service');

const createCheckoutSession = async (req, res, next) => {
  try {
    const result = await stripeService.createCheckoutSession(req.user.id, req.user.email);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const handleWebhook = async (req, res, _next) => {
  try {
    const signature = req.headers['stripe-signature'];
    const result = await stripeService.handleWebhook(req.body, signature);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSubscriptionStatus = async (req, res, next) => {
  try {
    const status = await stripeService.getSubscriptionStatus(req.user.id);
    res.json(status);
  } catch (error) {
    next(error);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    await stripeService.cancelSubscription(req.user.id);
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCheckoutSession, handleWebhook, getSubscriptionStatus, cancelSubscription };
