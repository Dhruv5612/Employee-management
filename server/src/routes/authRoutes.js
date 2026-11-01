import { Router } from 'express';
import {
  login,
  signup,
  requestLoginOtp,
  verifyLoginOtp,
  requestSignupOtp,
  verifySignupOtp,
  resendOtp,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  updateProfile,
  listUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  loginSchema,
  signupSchema,
  requestOtpSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  updateUserRoleSchema,
} from '../validators/authValidator.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

// Public auth routes
// Option 1: Password Login
router.post('/login', validateRequest(loginSchema), login);
router.post('/signin', validateRequest(loginSchema), login); // alias

// Option 2: Gmail OTP Login (Passwordless)
router.post('/login/request-otp', validateRequest(requestOtpSchema), requestLoginOtp);
router.post('/login/verify-otp', validateRequest(verifyOtpSchema), verifyLoginOtp);

// Registration & OTP verification
router.post('/signup', validateRequest(signupSchema), signup);
router.post('/register', validateRequest(signupSchema), signup); // alias
router.post('/signup/request-otp', validateRequest(signupSchema), requestSignupOtp);
router.post('/signup/verify-otp', validateRequest(verifyOtpSchema), verifySignupOtp);

router.post('/resend-otp', validateRequest(resendOtpSchema), resendOtp);

router.post('/logout', logout);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validateRequest(resetPasswordSchema), resetPassword);
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);

// Authenticated user profile & settings routes
router.get('/me', authenticate, getMe);
router.patch('/profile', authenticate, validateRequest(updateProfileSchema), updateProfile);
router.post('/change-password', authenticate, validateRequest(changePasswordSchema), changePassword);

// Admin-only user management routes
router.get('/users', authenticate, authorize('Admin'), listUsers);
router.patch('/users/:id', authenticate, authorize('Admin'), validateRequest(updateUserRoleSchema), updateUserRole);
router.delete('/users/:id', authenticate, authorize('Admin'), deleteUser);

export default router;
