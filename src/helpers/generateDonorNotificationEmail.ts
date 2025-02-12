export const generateDonorNotificationEmail = (
  donorName: string,
  recipientName: string,
  bloodGroup: string,
  location: string,
  hospitalName: string,
  contactNumber: string,
  donationDate: string,
  requestId: string,
  message: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Blood Donation Request</title>
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
          color: #d32f2f;
          font-size: 22px;
        }
        p {
          color: #555;
          font-size: 16px;
          line-height: 1.5;
        }
        .details {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 6px;
          text-align: left;
          margin: 20px 0;
        }
        .details p {
          margin: 8px 0;
        }
        .message-box {
          background: #fff3cd;
          padding: 15px;
          border-left: 5px solid #ffc107;
          border-radius: 6px;
          text-align: left;
          margin: 20px 0;
          font-style: italic;
        }
        .button {
          display: inline-block;
          color: white;
          font-size: 16px;
          font-weight: bold;
          padding: 12px 20px;
          border-radius: 6px;
          margin: 10px 5px;
          text-decoration: none;
        }
        .approve {
          background: #28a745;
        }
        .approve:hover {
          background: #218838;
        }
        .cancel {
          background: #dc3545;
        }
        .cancel:hover {
          background: #c82333;
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
        <img class="logo" src="https://your-logo-url.com/logo.png" alt="Blood Donation">
        <h2>Blood Donation Request</h2>
        <p>Dear <strong>${donorName}</strong>,</p>
        <p>A patient is in urgent need of blood, and you have been selected as a potential donor.</p>
        
        <div class="details">
          <p><strong>Request Id:</strong> ${requestId}</p>
          <p><strong>Recipient Name:</strong> ${recipientName}</p>
          <p><strong>Blood Group:</strong> ${bloodGroup}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Hospital:</strong> ${hospitalName}</p>
          <p><strong>Contact:</strong> ${contactNumber}</p>
          <p><strong>Donation Date:</strong> ${donationDate}</p>
        </div>

        <div class="message-box">
          <p><strong>Message from the requester:</strong></p>
          <p>"${message}"</p>
        </div>

        <p><strong>If you are willing to donate, please approve the request. Otherwise, you can cancel it from your dashboard.</strong></p>
        
        <a href="https://blood-donation24.netlify.app/my-donate-request" class="button approve">✅ Approve Request</a>
        <a href="https://blood-donation24.netlify.app/my-donate-request" class="button cancel">❌ Cancel Request</a>

        <p class="footer">For any questions, contact us at <a href="mailto:support@blooddonation.com">support@blooddonation.com</a></p>
      </div>
    </body>
    </html>
  `;
};
