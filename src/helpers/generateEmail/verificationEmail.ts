const verificationEmail = (verificationCode: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 500px;
          margin: 30px auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .logo {
          width: 60px;
          margin-bottom: 10px;
        }
        h2 {
          color: #333;
          font-size: 22px;
        }
        p {
          color: #555;
          font-size: 16px;
          line-height: 1.5;
        }
        .code {
          display: inline-block;
          background: #ff4d4d;
          color: white;
          font-size: 20px;
          font-weight: bold;
          padding: 12px 24px;
          border-radius: 6px;
          margin: 20px 0;
          text-decoration: none;
        }
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" src="https://blood-donation24.netlify.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.3dff7855.jpg&w=48&q=75" alt="Blood Donation">
        <h2>Email Verification</h2>
        <p>Use the verification code below to complete your registration. The code is valid for <strong>10 minutes</strong>.</p>
        <div class="code">${verificationCode}</div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p class="footer">Need help? Contact us at <a href="mailto:support@blooddonation.com">support@blooddonation.com</a></p>
      </div>
    </body>
    </html>
  `;
};
export default verificationEmail;
