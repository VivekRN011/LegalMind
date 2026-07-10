const Stripe = require('stripe');
const config = require('../config');
const prisma = require('../config/database');
const logger = require('../config/logger');

class StripeService {
  constructor() {
    // Billing is optional. Only initialize Stripe when a key is configured
    // so the core app can boot without payments wired up (e.g. demo/free tier).
    this.stripe = config.stripe.secretKey
      ? new Stripe(config.stripe.secretKey)
      : null;
    if (!this.stripe) {
      logger.warn('STRIPE_SECRET_KEY not set - billing endpoints are disabled');
    }
  }

  _ensureConfigured() {
    if (!this.stripe) {
      const error = new Error('Billing is not configured on this server');
      error.statusCode = 503;
      throw error;
    }
  }

  async createCheckoutSession(userId, userEmail) {
    this._ensureConfigured();
    // Get or create Stripe customer
    let user = await prisma.user.findUnique({ where: { id: userId } });
    
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: userEmail,
        metadata: { userId }
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId }
      });
    }

    // Create checkout session
    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: config.stripe.priceProId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${config.frontendUrl}/dashboard?upgrade=success`,
      cancel_url: `${config.frontendUrl}/dashboard?upgrade=cancelled`,
      metadata: { userId }
    });

    logger.info(`Checkout session created for user: ${userId}`);

    return { sessionId: session.id, url: session.url };
  }

  async handleWebhook(payload, signature) {
    this._ensureConfigured();
    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe.webhookSecret
      );
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      throw new Error('Webhook signature verification failed');
    }

    logger.info(`Processing Stripe webhook: ${event.type}`);

    switch (event.type) {
    case 'checkout.session.completed':
      await this.handleCheckoutComplete(event.data.object);
      break;

    case 'customer.subscription.updated':
      await this.handleSubscriptionUpdate(event.data.object);
      break;

    case 'customer.subscription.deleted':
      await this.handleSubscriptionCancelled(event.data.object);
      break;

    default:
      logger.info(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  async handleCheckoutComplete(session) {
    const userId = session.metadata.userId;

    if (!userId) {
      logger.warn('Checkout completed without userId in metadata');
      return;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'PRO',
        documentsLimit: config.plans.PRO.documentsLimit,
        stripeSubscriptionId: session.subscription
      }
    });

    logger.info(`User upgraded to PRO: ${userId}`);
  }

  async handleSubscriptionUpdate(subscription) {
    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (!user) {
      logger.warn(`No user found for subscription: ${subscription.id}`);
      return;
    }

    // Check if subscription is active
    const isActive = subscription.status === 'active';

    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: isActive ? 'PRO' : 'FREE',
        documentsLimit: isActive ? config.plans.PRO.documentsLimit : config.plans.FREE.documentsLimit
      }
    });

    logger.info(`Subscription updated for user: ${user.id}, status: ${subscription.status}`);
  }

  async handleSubscriptionCancelled(subscription) {
    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (!user) return;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: 'FREE',
        documentsLimit: config.plans.FREE.documentsLimit,
        stripeSubscriptionId: null
      }
    });

    logger.info(`Subscription cancelled for user: ${user.id}`);
  }

  async getSubscriptionStatus(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        documentsUsed: true,
        documentsLimit: true,
        stripeSubscriptionId: true
      }
    });

    if (!this.stripe || !user.stripeSubscriptionId) {
      return { ...user, subscriptionStatus: null };
    }

    const subscription = await this.stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    );

    return {
      ...user,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    };
  }

  async cancelSubscription(userId) {
    this._ensureConfigured();
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user.stripeSubscriptionId) {
      const error = new Error('No active subscription');
      error.statusCode = 400;
      throw error;
    }

    await this.stripe.subscriptions.cancel(user.stripeSubscriptionId);

    logger.info(`Subscription cancelled by user: ${userId}`);
  }
}

module.exports = new StripeService();
