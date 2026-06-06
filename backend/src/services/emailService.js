const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Store test account credentials globally to avoid recreating in dev
let transporter;

const initTransporter = async () => {
  if (transporter) return transporter;

  try {
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    return transporter;
  } catch (error) {
    logger.error('Failed to configure email transporter', error);
  }
};

/**
 * Send an onboarding email with credentials using a minimal customizable template.
 */
exports.sendOnboardingEmail = async (internName, internEmail, tempPassword) => {
  const mailTransporter = await initTransporter();
  if (!mailTransporter) return;

  const subject = `Welcome to Movi Cloud Labs, ${internName}!`;
  
  // Keep template customizable
  const htmlTemplate = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #4f6ef7;">Welcome to Movi Cloud Labs!</h2>
      <p>Hi ${internName},</p>
      <p>We are thrilled to have you join us. Your intern workspace account has been created.</p>
      <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Login Link:</strong> <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login">Click here</a></p>
        <p style="margin: 10px 0 0 0;"><strong>Email:</strong> ${internEmail}</p>
        <p style="margin: 10px 0 0 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      <p style="color: #64748b; font-size: 13px;">Please make sure to change your password after your first login.</p>
      <p>Best regards,<br>The HR Team</p>
    </div>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: '"Movi Cloud Labs HR" <hr@movicloudlabs.com>',
      to: internEmail,
      subject: subject,
      html: htmlTemplate,
    });

    logger.info(`Email sent: ${info.messageId}`);
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    return info;
  } catch (error) {
    logger.error('Error sending onboarding email', error);
  }
};
