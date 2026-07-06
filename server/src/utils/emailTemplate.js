export const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333333;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header / Logo Area -->
        <tr>
          <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #4f46e5;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Password Reset Request</h1>
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px;">
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #4b5563;">Hi ${name || 'there'},</p>
            
            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #4b5563;">
              We received a request to reset your password. Please use the verification code below to complete the request.
            </p>
            
            <!-- OTP Display Box -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto 10px auto;">
              <tr>
                <td style="background-color: #f3f4f6; padding: 16px 32px; border-radius: 6px; letter-spacing: 6px; font-size: 32px; font-weight: 700; color: #1f2937; text-align: center; border: 1px dashed #d1d5db;">
                  ${otp}
                </td>
              </tr>
            </table>
            
            <!-- Expiration Notice -->
            <p style="margin: 0 0 30px 0; font-size: 14px; font-weight: 600; color: #dc2626; text-align: center;">
              ⚠️ This code is valid for 10 minutes only.
            </p>
            
            <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.5; color: #9ca3af; text-align: center;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af;">
            <p style="margin: 0 0 4px 0;">&copy; ${new Date().getFullYear()} Rojsewa All rights reserved.</p>
            <p style="margin: 0;">Hazaribag, Jharkhand 825301</p>
          </td>
        </tr>
        
      </table>
    </body>
    </html>
  `;
};

export const verifyEmailTemplate = ({ name, otp }) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Email Verification</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:30px 15px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">

<tr>
<td style="background:#2563eb;padding:24px;text-align:center;">
<h1 style="margin:0;color:#ffffff;font-size:28px;">
RojSewa
</h1>
<p style="margin:8px 0 0;color:#dbeafe;font-size:14px;">
Local Services, Trusted Professionals
</p>
</td>
</tr>

<tr>
<td style="padding:40px;">

<h2 style="margin:0 0 20px;color:#111827;font-size:24px;">
Verify your email address
</h2>

<p style="margin:0 0 16px;font-size:16px;color:#4b5563;line-height:1.7;">
Hello <strong>${name || "User"}</strong>,
</p>

<p style="margin:0 0 24px;font-size:16px;color:#4b5563;line-height:1.7;">
Thank you for creating your RojSewa account.
Use the verification code below to complete your registration.
</p>

<table align="center" cellpadding="0" cellspacing="0">
<tr>
<td style="
padding:18px 36px;
border:2px solid #2563eb;
border-radius:8px;
font-size:34px;
font-weight:bold;
letter-spacing:10px;
color:#2563eb;
text-align:center;
font-family:monospace;
">
${otp}
</td>
</tr>
</table>

<p style="margin:24px 0 0;text-align:center;color:#dc2626;font-size:14px;">
This verification code will expire in <strong>1 hour</strong>.
</p>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">

<p style="margin:0;font-size:14px;color:#6b7280;line-height:1.7;">
If you didn't create a RojSewa account, you can safely ignore this email.
No further action is required.
</p>

</td>
</tr>

<tr>
<td style="padding:24px;background:#f9fafb;text-align:center;border-top:1px solid #e5e7eb;">

<p style="margin:0;color:#6b7280;font-size:14px;">
© ${new Date().getFullYear()} RojSewa. All rights reserved.
</p>

<p style="margin:8px 0 0;color:#9ca3af;font-size:13px;">
Hazaribag, Jharkhand, India
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;