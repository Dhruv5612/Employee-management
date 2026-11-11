import nodemailer from 'nodemailer';
import dns from 'dns/promises';

const RESERVED_DEMO_DOMAINS = new Set([
  'company.com',
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'test.org',
  'localhost',
  'invalid',
  'local',
]);

const RESERVED_TLD_SUFFIXES = ['.test', '.invalid', '.local', '.localhost', '.example'];

class EmailService {
  constructor() {
    // Dynamic transporter lookup
  }

  /**
   * Prevent sending real SMTP traffic to placeholder/demo domains or domains without MX records,
   * which otherwise triggers 72-hour Gmail Mail Delivery Subsystem retry/bounce storms.
   */
  async checkDeliverability(email) {
    const normalized = (email || '').trim().toLowerCase();
    const parts = normalized.split('@');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return { deliverable: false, reason: 'invalid_email_format' };
    }

    const [localPart, domain] = parts;

    if (localPart.startsWith('debug_user_test')) {
      return { deliverable: false, reason: 'debug_test_address' };
    }

    if (
      RESERVED_DEMO_DOMAINS.has(domain) ||
      RESERVED_TLD_SUFFIXES.some((suffix) => domain.endsWith(suffix))
    ) {
      return { deliverable: false, reason: 'demo_or_reserved_domain' };
    }

    let timer;
    try {
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(Object.assign(new Error('DNS MX lookup timeout'), { code: 'ETIMEDOUT' })),
          2500
        );
      });
      const mxRecords = await Promise.race([dns.resolveMx(domain), timeoutPromise]);
      if (!mxRecords || mxRecords.length === 0) {
        return { deliverable: false, reason: 'no_mx_record' };
      }
      return { deliverable: true };
    } catch (err) {
      if (err && (err.code === 'ENOTFOUND' || err.code === 'ENODATA')) {
        return { deliverable: false, reason: `dns_${err.code.toLowerCase()}` };
      }
      // Fail-open on transient DNS lookup errors so valid addresses still work
      return { deliverable: true };
    } finally {
      clearTimeout(timer);
    }
  }

  getTransporter() {
    const user = (process.env.GMAIL_USER || process.env.EMAIL_USER || '').trim();
    // Google App Passwords often have spaces: 'abcd efgh ijkl mnop'
    const rawPass = (process.env.GMAIL_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD || '').trim();
    const pass = rawPass.replace(/\s+/g, '');

    if (user && pass) {
      try {
        return nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user,
            pass,
          },
        });
      } catch (err) {
        console.error('[EmailService] Could not initialize Gmail transporter:', err.message);
        return null;
      }
    }
    console.warn('[EmailService] GMAIL_USER or GMAIL_PASS is not detected in environment variables. user present:', !!user, 'pass present:', !!pass);
    return null;
  }

  async sendOtpEmail({ to, name = 'User', otp, purpose = 'Sign In Approval' }) {
    const lowerPurpose = (purpose || '').toLowerCase();
    const isSignup =
      lowerPurpose.includes('signup') ||
      lowerPurpose.includes('register') ||
      lowerPurpose.includes('registrat');
    const title = isSignup ? 'Verify Your Work Email' : 'Sign In Approval Code';
    const subtitle = isSignup
      ? 'Use this one-time code to complete your Employee Management registration.'
      : 'Use this one-time code to log in securely without a password.';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #4f46e5, #4338ca); color: #ffffff; padding: 28px 24px; text-align: center; }
          .logo { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
          .content { padding: 32px 28px; }
          .greeting { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
          .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 18px; text-align: center; margin-bottom: 24px; }
          .otp-code { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; font-family: monospace; }
          .otp-expiry { font-size: 12px; color: #64748b; margin-top: 6px; font-weight: 600; }
          .security-note { font-size: 12px; color: #94a3b8; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 18px; }
          .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">EmployeeHub Enterprise</div>
            <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">${title}</div>
          </div>
          <div class="content">
            <div class="greeting">Hello ${name},</div>
            <div class="message">${subtitle}</div>
            
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <div class="otp-expiry">Valid for 10 minutes &bull; Do not share with anyone</div>
            </div>

            <div class="security-note">
              <strong>Security Alert:</strong> If you did not initiate this ${purpose} request, please ignore this email or notify your system administrator.
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} EmployeeHub Enterprise. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(`=======================================================`);
    console.log(`📧 [EmailService] Gmail Approval OTP for ${to}`);
    console.log(`🔑 Purpose: ${purpose.toUpperCase()}`);
    console.log(`✨ OTP CODE: ${otp}`);
    console.log(`=======================================================`);

    const dispatch = await this.dispatchEmail({
      to,
      subject: `Your ${purpose} Code: ${otp} - Employee Management`,
      html: htmlContent,
      text: `Your ${purpose} code is ${otp}. Valid for 10 minutes.`,
    });

    return { ...dispatch, otp };
  }

  async dispatchEmail({ to, subject, html, text }) {
    const deliverability = await this.checkDeliverability(to);
    if (!deliverability.deliverable) {
      console.log(
        `[EmailService] Skipped outbound Gmail SMTP to ${to} (reason: ${deliverability.reason}) to prevent mail-daemon bounce loops.`
      );
      return {
        success: true,
        delivered: false,
        simulated: true,
        skippedReason: deliverability.reason,
      };
    }

    const transporter = this.getTransporter();
    if (!transporter) {
      console.log(`[EmailService] Gmail credentials not configured. Using simulated mode.`);
      return { success: true, delivered: false, simulated: true, skippedReason: 'smtp_not_configured' };
    }

    try {
      const sender = (process.env.GMAIL_USER || process.env.EMAIL_USER || '').trim();
      const info = await transporter.sendMail({
        from: `"Employee Management" <${sender}>`,
        to,
        subject,
        html,
        text,
      });
      console.log(`[EmailService] Real email successfully sent to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId, delivered: true, simulated: false };
    } catch (sendErr) {
      console.error(`[EmailService] Failed to send email via Gmail (${sendErr.message}). Fallback to simulated mode.`);
      return {
        success: true,
        delivered: false,
        simulated: true,
        skippedReason: 'smtp_send_failed',
        error: sendErr.message,
      };
    }
  }

  async sendPasswordResetEmail({ to, name = 'User', resetUrl, token }) {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #4f46e5, #4338ca); color: #ffffff; padding: 28px 24px; text-align: center; }
          .logo { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
          .content { padding: 32px 28px; }
          .greeting { font-size: 17px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .message { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
          .btn-container { text-align: center; margin: 28px 0; }
          .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35); }
          .link-box { background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 24px; word-break: break-all; font-size: 12px; color: #475569; }
          .security-note { font-size: 12px; color: #94a3b8; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 18px; }
          .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">EmployeeHub Enterprise</div>
            <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Password Recovery Service</div>
          </div>
          <div class="content">
            <div class="greeting">Hello ${name},</div>
            <div class="message">
              We received a request to change the password for your workspace account. Click the button below to set a new password:
            </div>
            
            <div class="btn-container">
              <a href="${resetUrl}" class="btn" target="_blank">Reset My Password</a>
            </div>

            <div class="message" style="margin-bottom: 8px; font-size: 13px;">
              If the button above does not work, copy and paste this URL into your web browser:
            </div>
            <div class="link-box">
              <a href="${resetUrl}" style="color: #4f46e5; text-decoration: underline;" target="_blank">${resetUrl}</a>
            </div>

            <div class="security-note">
              <strong>Security Notice:</strong> This password reset link is valid for <strong>60 minutes</strong>. If you did not request a password change, you can safely ignore this email; your account remains secure.
            </div>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} EmployeeHub Enterprise. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(`=======================================================`);
    console.log(`📧 [EmailService] Password Reset Email for ${to}`);
    console.log(`🔗 Reset URL: ${resetUrl}`);
    console.log(`🔑 Token: ${token}`);
    console.log(`=======================================================`);

    const dispatch = await this.dispatchEmail({
      to,
      subject: `Reset Your Password - Employee Management`,
      html: htmlContent,
      text: `Reset your password by visiting this link: ${resetUrl}. Valid for 60 minutes.`,
    });

    return { ...dispatch, resetUrl, token };
  }
}

export const emailService = new EmailService();
export default emailService;

