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
  console.log(`🔑 [FORGE EMAIL OTP VERIFICATION]`);
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
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 24px; color: #18181b; }
          .container { max-width: 520px; margin: 0 auto; background: #ffffff; border: 2px solid #18181b; padding: 36px 32px; box-shadow: 4px 4px 0 #ea580c; }
          .header { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
          .logo-box { background-color: #ea580c; color: #ffffff; font-weight: 900; width: 32px; height: 32px; border: 2px solid #111111; display: inline-flex; align-items: center; justify-content: center; font-family: 'Courier New', Courier, monospace; font-size: 18px; box-shadow: 2px 2px 0 #111111; }
          .brand { font-size: 20px; font-weight: 900; color: #09090b; letter-spacing: -0.5px; }
          .title { font-size: 22px; font-weight: 800; color: #09090b; margin-top: 0; margin-bottom: 8px; letter-spacing: -0.3px; }
          .subtitle { font-size: 14px; color: #52525b; line-height: 1.6; margin-bottom: 24px; }
          .otp-box { background: #fafafa; border: 2px dashed #ea580c; padding: 18px; text-align: center; font-size: 34px; font-weight: 900; font-family: 'Courier New', Courier, monospace; letter-spacing: 10px; color: #ea580c; margin-bottom: 24px; }
          .footer { font-size: 12px; color: #71717a; border-top: 1px solid #e4e4e7; padding-top: 18px; margin-top: 28px; line-height: 1.5; font-family: 'Courier New', Courier, monospace; }
          .footer a { color: #ea580c; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-box">F</div>
            <span class="brand">Forge</span>
          </div>
          <h1 class="title">Verify Your Email Address</h1>
          <p class="subtitle">Hi <strong>${name}</strong>,<br>Thank you for creating an account on Forge. Use the 6-digit verification code below to verify your email and complete your registration.</p>
          
          <div class="otp-box">${otp}</div>
          
          <p style="font-size: 13px; color: #52525b; line-height: 1.5;">This code will expire in <strong>10 minutes</strong>. If you did not request this verification, please safely ignore this message.</p>
          
          <div class="footer">
            <strong>Forge</strong> — Objective AI & Agent Benchmark Platform.<br>
            Secure, deterministic model intelligence • <a href="https://forgemodel.netlify.app">forgemodel.netlify.app</a>
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
    const fromAddress = process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER || "noreply@forgemodel.ai";
    const info = await transporter.sendMail({
      from: `"Forge Verification" <${fromAddress}>`,
      to: email,
      subject: `Your Forge Verification Code: ${otp}`,
      text: `Your Forge verification code is: ${otp}. It expires in 10 minutes.`,
      html: htmlContent,
    });

    console.log(`✅ [EMAIL SENT] Verification email delivered to ${email} (Message ID: ${info.messageId})`);
    return { success: true, delivered: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`⚠️ [EMAIL DISPATCH WARNING] Could not send via SMTP (${error.message}). Logged OTP to console for dev access.`);
    return { success: true, delivered: false, error: error.message, otp };
  }
};
