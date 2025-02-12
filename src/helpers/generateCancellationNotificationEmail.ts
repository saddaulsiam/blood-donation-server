export const generateCancellationNotificationEmail = (
  requesterName: string,
  donorName: string,
  bloodGroup: string,
  city: string,
  hospitalName: string,
  phoneNumber: string,
  dateOfDonation: string,
  requestId: string
) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blood Donation Request Cancelled</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f9f9f9;
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
      .header {
        background: #d9534f;
        color: white;
        padding: 15px;
        border-radius: 10px 10px 0 0;
        font-size: 20px;
        font-weight: bold;
      }
      .content {
        padding: 20px;
      }
      .logo {
        width: 60px;
        margin-bottom: 15px;
      }
      h2 {
        color: #d9534f;
        font-size: 22px;
      }
      p {
        color: #555;
        font-size: 16px;
        line-height: 1.6;
      }
      .info-box {
        background: #f8d7da;
        color: #721c24;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        font-size: 15px;
      }
      .button {
        display: inline-block;
        background: #d9534f;
        color: white;
        font-size: 18px;
        font-weight: bold;
        padding: 12px 24px;
        border-radius: 6px;
        text-decoration: none;
        margin-top: 15px;
      }
      .button:hover {
        background: #c9302c;
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
      <div class="header">Blood Donation Request Cancelled</div>
      <div class="content">
        <img class="logo" src="https://your-logo-url.com/logo.png" alt="Blood Donation">
        <h2>Hello, ${requesterName}</h2>
        <p>We regret to inform you that your blood donation request has been <strong style="color: #d9534f;">cancelled</strong> by the donor.</p>
        
        <div class="info-box">
          <p><strong>Donor Name:</strong> ${donorName}</p>
          <p><strong>Blood Group:</strong> ${bloodGroup}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Hospital:</strong> ${hospitalName}</p>
          <p><strong>Contact:</strong> ${phoneNumber}</p>
          <p><strong>Donation Date:</strong> ${dateOfDonation}</p>
        </div>

        <p>You can check the status of your request in your dashboard:</p>
        <a href="https://blood-donation24.netlify.app/request-to-donate" class="button">View Request</a>
        
        <p class="footer">Need help? Contact us at <a href="mailto:support@blooddonation.com">support@blooddonation.com</a></p>
      </div>
    </div>
  </body>
  </html>
  `;
};
