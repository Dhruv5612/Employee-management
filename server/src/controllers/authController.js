import { AuthService } from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);

  if (result.requiresOtp) {
    return res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  }

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

// Option 2: Gmail OTP Request (Passwordless or 2FA)
export const requestLoginOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.requestLoginOtp(email);

  res.status(200).json({
    success: true,
    message: result.message,
    data: result,
  });
});

// Option 2: Gmail OTP Verification
export const verifyLoginOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyLoginOtp({ email, otp });

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Gmail approval verified. Login successful.',
    data: result,
  });
});

export const requestSignupOtp = asyncHandler(async (req, res) => {
  const result = await AuthService.requestSignupOtp(req.body);

  res.status(200).json({
    success: true,
    message: result.message,
    data: result,
  });
});

export const verifySignupOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifySignupOtp({ email, otp });

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: 'Registration complete & verified!',
    data: result,
  });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;
  const result = await AuthService.resendOtp({ email, purpose });

  res.status(200).json({
    success: true,
    message: result.message,
    data: result,
  });
});

export const signup = asyncHandler(async (req, res) => {
  const result = await AuthService.signup(req.body);

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: result,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;
  const permissions = AuthService.getPermissions(user.role);

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar || '',
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
      },
      permissions,
    },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPassword(email);
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const result = await AuthService.resetPassword(token, password);
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token || req.body.token;
  const result = await AuthService.verifyEmail(token);
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await AuthService.changePassword(req.user._id, currentPassword, newPassword);
  res.status(200).json({
    success: true,
    ...result,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await AuthService.updateProfile(req.user._id, req.body);
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await AuthService.listUsers();
  res.status(200).json({
    success: true,
    data: users,
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const updated = await AuthService.updateUserRole(req.params.id, req.body, req.user?._id);
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: updated,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const result = await AuthService.deleteUser(req.params.id, req.user?._id);
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});
