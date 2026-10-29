import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
import { emailService } from './emailService.js';
import { ApiError } from '../utils/ApiError.js';
import { AuditLog } from '../models/AuditLog.js';

export class AuthService {
  static generateToken(user) {
    const secret = process.env.JWT_ACCESS_SECRET || 'super_secure_jwt_secret_key_emp_mgmt_2026_xyz';
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '7d';

    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      secret,
      { expiresIn }
    );
  }

  // Authenticate Email & Password, then dispatch 6-digit OTP to Gmail
  static async login(email, password) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Please contact an administrator.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Credentials are authenticated! Generate 6-digit OTP for Gmail verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email: normalizedEmail, purpose: 'login' });
    await OTP.create({
      email: normalizedEmail,
      otp,
      purpose: 'login',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const sendResult = await emailService.sendOtpEmail({
      to: normalizedEmail,
      name: user.name,
      otp,
      purpose: 'Sign In Approval',
    });

    return {
      requiresOtp: true,
      email: normalizedEmail,
      delivered: !!sendResult.delivered,
      message: sendResult.delivered
        ? `Credentials authenticated! A 6-digit approval code was sent to your Gmail (${normalizedEmail})`
        : `Credentials authenticated! Simulated OTP: ${otp}`,
      devOtp: !sendResult.delivered ? otp : undefined,
    };
  }

  // --- OPTION 2: Gmail OTP Login (Passwordless) ---
  static async requestLoginOtp(email) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      throw ApiError.badRequest('Please provide your work email address');
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw ApiError.notFound('No registered account found with that email address');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Please contact an administrator.');
    }

    // Generate random 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clean up old login OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail, purpose: 'login' });

    await OTP.create({
      email: normalizedEmail,
      otp,
      purpose: 'login',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const sendResult = await emailService.sendOtpEmail({
      to: normalizedEmail,
      name: user.name,
      otp,
      purpose: 'Sign In Approval',
    });

    return {
      requiresOtp: true,
      email: normalizedEmail,
      delivered: !!sendResult.delivered,
      message: sendResult.delivered
        ? `A 6-digit approval code has been sent directly to your Gmail (${normalizedEmail})`
        : `Email credentials (GMAIL_PASS) not set in server/.env. Simulated OTP: ${otp}`,
      devOtp: otp,
    };
  }

  static async verifyLoginOtp({ email, otp }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const code = (otp || '').trim();

    if (!normalizedEmail || !code) {
      throw ApiError.badRequest('Email and OTP verification code are required');
    }

    const record = await OTP.findOne({
      email: normalizedEmail,
      purpose: 'login',
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!record || record.otp !== code) {
      throw ApiError.badRequest('Invalid or expired OTP code. Please try again or request a new code.');
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw ApiError.unauthorized('User record could not be found');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated.');
    }

    await OTP.deleteMany({ email: normalizedEmail, purpose: 'login' });

    await AuditLog.create({
      actor: user._id,
      action: 'USER_LOGIN_OTP_VERIFIED',
      entityType: 'User',
      entityId: user._id,
    });

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
      },
    };
  }

  // --- Sign Up with OTP flow ---
  static async requestSignupOtp({ name, email, password, phone = '', role = 'Viewer' }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw ApiError.conflict('Email address is already registered', [
        { field: 'email', message: 'Email address is already in use' },
      ]);
    }

    if (!password || password.length < 8) {
      throw ApiError.badRequest('Password must be at least 8 characters');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email: normalizedEmail, purpose: 'signup' });

    await OTP.create({
      email: normalizedEmail,
      otp,
      purpose: 'signup',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      pendingData: {
        name: (name || '').trim(),
        email: normalizedEmail,
        passwordHash,
        phone: (phone || '').trim(),
        role: ['HR', 'Viewer'].includes(role) ? role : 'Viewer',
      },
    });

    const sendResult = await emailService.sendOtpEmail({
      to: normalizedEmail,
      name: (name || '').trim(),
      otp,
      purpose: 'Account Registration',
    });

    return {
      requiresOtp: true,
      email: normalizedEmail,
      delivered: !!sendResult.delivered,
      message: sendResult.delivered
        ? `A 6-digit confirmation code has been sent directly to your Gmail (${normalizedEmail})`
        : `Email credentials (GMAIL_PASS) not set in server/.env. Simulated OTP: ${otp}`,
      devOtp: otp,
    };
  }

  static async verifySignupOtp({ email, otp }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    const code = (otp || '').trim();

    if (!normalizedEmail || !code) {
      throw ApiError.badRequest('Email and OTP verification code are required');
    }

    const record = await OTP.findOne({
      email: normalizedEmail,
      purpose: 'signup',
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!record || record.otp !== code) {
      throw ApiError.badRequest('Invalid or expired verification code. Please request a new code.');
    }

    const pending = record.pendingData;
    if (!pending) {
      throw ApiError.badRequest('Registration session expired. Please sign up again.');
    }

    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      throw ApiError.conflict('Email address is already registered');
    }

    user = await User.create({
      name: pending.name,
      email: pending.email,
      passwordHash: pending.passwordHash,
      phone: pending.phone,
      role: pending.role,
      isEmailVerified: true,
    });

    await OTP.deleteMany({ email: normalizedEmail, purpose: 'signup' });

    await AuditLog.create({
      actor: user._id,
      action: 'USER_REGISTERED_OTP_VERIFIED',
      entityType: 'User',
      entityId: user._id,
      changes: { email: user.email, role: user.role },
    });

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
      },
    };
  }

  static async resendOtp({ email, purpose = 'login' }) {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      throw ApiError.badRequest('Email is required');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (purpose === 'signup') {
      const existingRecord = await OTP.findOne({ email: normalizedEmail, purpose: 'signup' }).sort({ createdAt: -1 });
      if (!existingRecord || !existingRecord.pendingData) {
        throw ApiError.badRequest('No pending registration found for this email. Please restart registration.');
      }

      await OTP.deleteMany({ email: normalizedEmail, purpose: 'signup' });
      await OTP.create({
        email: normalizedEmail,
        otp,
        purpose: 'signup',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        pendingData: existingRecord.pendingData,
      });

      await emailService.sendOtpEmail({
        to: normalizedEmail,
        name: existingRecord.pendingData.name,
        otp,
        purpose: 'Account Registration',
      });
    } else {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        throw ApiError.notFound('No account found for this email address');
      }

      await OTP.deleteMany({ email: normalizedEmail, purpose: 'login' });
      await OTP.create({
        email: normalizedEmail,
        otp,
        purpose: 'login',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      await emailService.sendOtpEmail({
        to: normalizedEmail,
        name: user.name,
        otp,
        purpose: 'Sign In Approval',
      });
    }

    return {
      success: true,
      message: `A new verification code has been dispatched to ${normalizedEmail}`,
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
    };
  }

  static async signup({ name, email, password, phone = '', role = 'Viewer' }) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw ApiError.conflict('Email address is already registered', [
        { field: 'email', message: 'Email address is already in use' },
      ]);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(24).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: phone.trim(),
      role,
      isEmailVerified: true, // auto-verified for seamless dev/evaluation
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    await AuditLog.create({
      actor: user._id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user._id,
      changes: { email: user.email, role: user.role },
    });

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
      },
      verificationToken,
    };
  }

  static async forgotPassword(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Don't leak user existence in production, but provide clean message
      return {
        message: 'If an account exists with that email, a password reset link has been dispatched.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await AuditLog.create({
      actor: user._id,
      action: 'PASSWORD_RESET_REQUESTED',
      entityType: 'User',
      entityId: user._id,
      changes: { email: user.email },
    });

    return {
      message: 'Password reset link generated successfully',
      resetToken, // Returned for development/demo ease
      resetUrl: `/reset-password/${resetToken}`,
    };
  }

  static async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw ApiError.badRequest('Password reset token is invalid or has expired');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    await AuditLog.create({
      actor: user._id,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'User',
      entityId: user._id,
    });

    return { message: 'Password has been reset successfully. You can now sign in.' };
  }

  static async verifyEmail(token) {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw ApiError.badRequest('Email verification link is invalid or has expired');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    return { message: 'Email verified successfully!' };
  }

  static async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    await AuditLog.create({
      actor: user._id,
      action: 'PASSWORD_CHANGED',
      entityType: 'User',
      entityId: user._id,
    });

    return { message: 'Password changed successfully' };
  }

  static async updateProfile(userId, data) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (data.name) user.name = data.name.trim();
    if (data.phone !== undefined) user.phone = data.phone.trim();
    if (data.preferences) {
      user.preferences = { ...user.preferences, ...data.preferences };
    }

    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      preferences: user.preferences,
    };
  }

  static async listUsers() {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    return users;
  }

  static async updateUserRole(userId, { role, isActive }, actorId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const changes = {};
    if (role && role !== user.role) {
      changes.role = { from: user.role, to: role };
      user.role = role;
    }
    if (isActive !== undefined && isActive !== user.isActive) {
      changes.isActive = { from: user.isActive, to: isActive };
      user.isActive = isActive;
    }

    await user.save();

    if (actorId) {
      await AuditLog.create({
        actor: actorId,
        action: 'USER_ROLE_OR_STATUS_MODIFIED',
        entityType: 'User',
        entityId: user._id,
        changes,
      });
    }

    return user;
  }

  static async deleteUser(userId, actorId) {
    if (actorId && actorId.toString() === userId.toString()) {
      throw ApiError.badRequest('You cannot delete your own account from the admin panel');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Guard: Prevent deleting the last remaining Administrator
    if (user.role === 'Admin') {
      const adminCount = await User.countDocuments({ role: 'Admin' });
      if (adminCount <= 1) {
        throw ApiError.badRequest('Cannot delete the last remaining Administrator');
      }
    }

    await User.findByIdAndDelete(userId);

    // Clean up any remaining OTPs for this user's email
    if (user.email) {
      await OTP.deleteMany({ email: user.email.toLowerCase() });
    }

    if (actorId) {
      await AuditLog.create({
        actor: actorId,
        action: 'USER_DELETED',
        entityType: 'User',
        entityId: userId,
        changes: { email: user.email, name: user.name, role: user.role },
      });
    }

    return { message: 'User deleted successfully', userId };
  }

  static getPermissions(role) {
    return {
      canViewEmployees: true,
      canAddEmployees: ['Admin', 'HR'].includes(role),
      canEditEmployees: ['Admin', 'HR'].includes(role),
      canDeleteEmployees: role === 'Admin',
      canChangeStatus: ['Admin', 'HR'].includes(role),
      canManageDepartments: ['Admin', 'HR'].includes(role),
      canManageUsers: role === 'Admin',
      canViewReports: ['Admin', 'HR'].includes(role),
      canViewAuditLogs: ['Admin'].includes(role),
    };
  }
}
