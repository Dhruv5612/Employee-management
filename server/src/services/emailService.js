import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    // Dynamic transporter lookup
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
        console.warn('[EmailService] Could not initialize Gmail transporter:', err.message);
        return null;
      }
    }
    return null;
  }

  async sendOtpEmail({ to, name = 'User', otp, purpose = 'Sign In Approval' }) {
    const isSignup = purpose.toLowerCase().includes('signup') || purpose.toLowerCase().includes('register');
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
            <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Gmail Authentication & Approval</div>
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

    const transporter = this.getTransporter();
    if (transporter) {
      try {
        const sender = (process.env.GMAIL_USER || process.env.EMAIL_USER || '').trim();
        const info = await transporter.sendMail({
          from: `"Employee Management" <${sender}>`,
          to,
          subject: `Your ${purpose} Code: ${otp} - Employee Management`,
          html: htmlContent,
          text: `Your ${purpose} code is ${otp}. Valid for 10 minutes.`,
        });
        console.log(`[EmailService] Real email successfully sent to ${to}: ${info.messageId}`);
        return { success: true, messageId: info.messageId, delivered: true, otp };
      } catch (sendErr) {
        console.error(`[EmailService] Failed to send email via Gmail (${sendErr.message}). Fallback to console OTP.`);
        return { success: true, delivered: false, simulated: true, otp, error: sendErr.message };
      }
    } else {
      console.log(`[EmailService] Gmail credentials not yet set in server/.env. Using console OTP mode.`);
    }

    return { success: true, delivered: false, simulated: true, otp };
  }
}

export const emailService = new EmailService();
export default emailService;

