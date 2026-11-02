import { ApiError } from '../utils/ApiError.js';

export function errorHandler(err, req, res, next) {
  let error = err;

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    error = ApiError.conflict(`Duplicate value '${value}' entered for ${field}`, [
      { field, message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` },
    ]);
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Validation failed', errors);
  }

  // Handle Mongoose DB buffering timeout (MongoDB Atlas unreachable or wrong credentials)
  if (err.message && err.message.includes('buffering timed out')) {
    error = ApiError.internal(
      'Database connection failed. Please check MONGODB_URI in your Vercel Environment Variables and verify username/password, and ensure MongoDB Atlas Network Access has 0.0.0.0/0 enabled.'
    );
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  const errors = error.errors || [];

  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
  };

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
