const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const config = require('../config');

class AuthService {
  async register(email, password, name = null) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        plan: 'FREE',
        documentsUsed: 0,
        documentsLimit: config.plans.FREE.documentsLimit
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        documentsUsed: true,
        documentsLimit: true,
        createdAt: true
      }
    });

    // Generate token
    const token = this.generateToken(user.id);

    return { user, token };
  }

  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        documentsUsed: user.documentsUsed,
        documentsLimit: user.documentsLimit
      },
      token
    };
  }

  generateToken(userId) {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
  }

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        documentsUsed: true,
        documentsLimit: true,
        stripeCustomerId: true,
        createdAt: true
      }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}

module.exports = new AuthService();
