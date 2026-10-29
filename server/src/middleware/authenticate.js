import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';

export async function authenticate(req, res, next) {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(ApiError.unauthorized('Authentication token is missing'));
    }

    const secret = process.env.JWT_ACCESS_SECRET || 'super_secure_jwt_secret_key_emp_mgmt_2026_xyz';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return next(ApiError.unauthorized('User not found or account is deactivated'));
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Invalid or expired authentication token'));
    }
    next(err);
  }
}
