import nodemailer from "nodemailer";

// Setup transporter with support for Gmail / SMTP / Fallback
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASS;

  if (user && pass) {
    if (host) {
      return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      // Default to Gmail service if user provided without host
      return nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
    }
  }

  // Fallback / Development mode transporter
  return null;
};

/**
 * Send 6-digit OTP verification email
 * @param {string} email - Destination email address
 * @param {string} otp - 6-digit verification code
 * @param {string} name - User's full name
 */
export const sendOtpEmail = async (email, otp, name = "there") => {
  const transporter = createTransporter();

  // Always log clearly to server console for instant local development verification
  console.log("\n==================================================");
  console.log(`🔑 [MODELHUB EMAIL OTP VERIFICATION]`);
  console.log(`📧 Target Email: ${email}`);
  console.log(`👤 User Name:    ${name}`);
  console.log(`🔢 6-DIGIT OTP:   >>> ${otp} <<<`);
  console.log(`⏰ Expiration:   10 Minutes`);
  console.log("==================================================\n");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 20px; color: #18181b; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e4e4e7; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .header { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
          .logo { background-color: #ea580c; color: #ffffff; font-weight: bold; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; font-family: monospace; font-size: 14px; }
          .brand { font-size: 18px; font-weight: bold; color: #09090b; }
          .title { font-size: 20px; font-weight: 700; color: #09090b; margin-top: 0; margin-bottom: 8px; }
          .subtitle { font-size: 14px; color: #71717a; line-height: 1.5; margin-bottom: 24px; }
          .otp-box { background: #f4f4f5; border: 1px solid #e4e4e7; padding: 18px; text-align: center; font-size: 32px; font-weight: 800; font-family: monospace; letter-spacing: 8px; color: #ea580c; margin-bottom: 24px; }
          .footer { font-size: 12px; color: #a1a1aa; border-top: 1px solid #f4f4f5; padding-top: 16px; margin-top: 24px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">M</div>
            <span class="brand">ModelHub</span>
          </div>
          <h1 class="title">Verify Your Email Address</h1>
          <p class="subtitle">Hi <strong>${name}</strong>,<br>Thank you for creating an account on ModelHub. Use the 6-digit verification code below to verify your email and complete your registration.</p>
          
          <div class="otp-box">${otp}</div>
          
          <p style="font-size: 13px; color: #52525b; line-height: 1.5;">This code will expire in <strong>10 minutes</strong>. If you did not request this verification, please safely ignore this message.</p>
          
          <div class="footer">
            ModelHub 9.0 — Objective AI & Agent Benchmark Platform.<br>
            Secure, deterministic model intelligence.
          </div>
        </div>
      </body>
    </html>
  `;

  if (!transporter) {
    return {
      success: true,
      delivered: false,
      mode: "development_console",
      otp,
    };
  }

  try {
    const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || "noreply@modelhub.ai";
    const info = await transporter.sendMail({
      from: `"ModelHub Verification" <${fromAddress}>`,
      to: email,
      subject: `Your ModelHub Verification Code: ${otp}`,
      text: `Your ModelHub verification code is: ${otp}. It expires in 10 minutes.`,
      html: htmlContent,
    });

    console.log(`✅ [EMAIL SENT] Verification email delivered to ${email} (Message ID: ${info.messageId})`);
    return { success: true, delivered: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`⚠️ [EMAIL DISPATCH WARNING] Could not send via SMTP (${error.message}). Logged OTP to console for dev access.`);
    return { success: true, delivered: false, error: error.message, otp };
  }
};
