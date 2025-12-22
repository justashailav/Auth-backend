export function generateEmailOTPTemplate(otp) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center;">
            <h2 style="color: #333;">Email Verification</h2>
            <p style="color: #555;">Your One-Time Password (OTP) for verification is:</p>
            <div style="font-size: 24px; font-weight: bold; padding: 10px; background: #f4f4f4; border-radius: 5px; display: inline-block;">
                ${otp}
            </div>
            <p style="color: #555; margin-top: 20px;">This OTP is valid for <strong>15 minutes</strong>. Do not share it with anyone.</p>
            <p style="color: #555;">If you didn’t request this, please ignore this email.</p>
        </div>
    </div>
    `;
}
export function generateForgotPasswordEmailTemplate(ResetPasswordUrl) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center;">
              <h2 style="color: #333;">Reset Your Password</h2>
              <p style="color: #555;">We received a request to reset your password. Click the button below to reset it:</p>
              <a href="${ResetPasswordUrl}" 
                 style="display: inline-block; font-size: 16px; font-weight: bold; padding: 12px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                  Reset Password
              </a>
              <p style="color: #555; margin-top: 20px;">If you did not request this, please ignore this email. The link will expire in 30 minutes.</p>
              <p style="color: #555;">If you have any questions, contact our support team.</p>
          </div>
      </div>
    `;
}
  
