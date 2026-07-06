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

export const verifyEmailTemplate = ({ name, otp }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email Address</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; color: #333333;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header / Logo Area -->
        <tr>
          <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #4f46e5;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Welcome to ROJSEWA!</h1>
          </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
          <td style="padding: 40px;">
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5; color: #4b5563;">Hi ${name || 'there'},</p>
            
            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.5; color: #4b5563;">
              Thank you for registering. Please use the verification code below to verify your email address and activate your account.
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
              ⚠️ This code is valid for 1 hour.
            </p>
            
            <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.5; color: #9ca3af; text-align: center;">
              If you did not sign up for an account, please disregard this email.
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