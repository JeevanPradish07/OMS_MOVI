import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async ({ to, name, email, tempPassword, employeeId }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Welcome to OWMS — Your Account Details',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#fff;border:1px solid #E2E8F0;border-radius:12px">
        <div style="background:#2563EB;border-radius:8px;padding:20px 24px;margin-bottom:28px">
          <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;letter-spacing:-0.3px">OWMS</h1>
          <p style="color:#93C5FD;margin:4px 0 0;font-size:13px">Office Workspace Management System</p>
        </div>

        <h2 style="color:#0F172A;font-size:18px;font-weight:600;margin:0 0 8px">Welcome, ${name}!</h2>
        <p style="color:#64748B;font-size:14px;margin:0 0 24px;line-height:1.6">
          Your account has been created by the administrator.
          Use the details below to log in for the first time.
        </p>

        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:20px;margin-bottom:24px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#64748B;font-size:13px;width:140px">Login URL</td>
              <td style="padding:8px 0;font-size:13px;font-weight:600;color:#2563EB">
                <a href="${process.env.APP_URL}/login" style="color:#2563EB">${process.env.APP_URL}/login</a>
              </td>
            </tr>
            <tr style="border-top:1px solid #E2E8F0">
              <td style="padding:8px 0;color:#64748B;font-size:13px">Email</td>
              <td style="padding:8px 0;font-size:13px;font-weight:600;color:#0F172A">${email}</td>
            </tr>
            <tr style="border-top:1px solid #E2E8F0">
              <td style="padding:8px 0;color:#64748B;font-size:13px">Employee ID</td>
              <td style="padding:8px 0;font-size:13px;font-weight:600;color:#0F172A;font-family:monospace">${employeeId}</td>
            </tr>
            <tr style="border-top:1px solid #E2E8F0">
              <td style="padding:8px 0;color:#64748B;font-size:13px">Temporary Password</td>
              <td style="padding:8px 0">
                <span style="background:#EFF6FF;color:#2563EB;font-family:monospace;font-size:15px;font-weight:700;padding:4px 10px;border-radius:6px;letter-spacing:1px">${tempPassword}</span>
              </td>
            </tr>
          </table>
        </div>

        <div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:8px;padding:12px 16px;margin-bottom:24px">
          <p style="color:#92400E;font-size:13px;margin:0">
            <strong>Important:</strong> Please change your password after your first login.
            Do not share your credentials with anyone.
          </p>
        </div>

        <p style="color:#94A3B8;font-size:12px;margin:0;text-align:center">
          This is an automated message from OWMS. Please do not reply to this email.
        </p>
      </div>
    `,
  });
};
