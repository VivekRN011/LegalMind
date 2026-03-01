const authService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const register = async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);
    const result = await authService.register(validated.email, validated.password, validated.name);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await authService.login(validated.email, validated.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };
