export const generateDonationRequestEmail = (
  donorName: string,
  bloodGroup: string,
  location: string,
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
      <title>Blood Donation Request Submitted</title>
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
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 20px;
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
          background-color:rgb(29, 26, 173)
          font-size: 16px;
          font-weight: bold;
          padding: 12px 20px;
          border-radius: 6px;
          margin: 10px 5px;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" src="https://your-logo-url.com/logo.png" alt="Blood Donation">
        <h2>Blood Donation Request Submitted</h2>
        <p>Dear <strong>${donorName}</strong>, your blood donation request has been successfully submitted. Below are the details:</p>
        <div class="details">
        <p><strong>Request ID:</strong> ${requestId}</p>
          <p><strong>Blood Group:</strong> ${bloodGroup}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Donation Date:</strong> ${donationDate}</p>
        </div>

        <div class="message-box">
          <p><strong>Message for Donor:</strong></p>
          <p>"${message}"</p>
        </div>

        <p>We appreciate your willingness to save lives. Our team will contact you soon regarding the next steps.</p>
          <a href="https://blood-donation24.netlify.app/request-to-donate" class="button">View Request</a>
        <p class="footer">Need help? Contact us at <a href="mailto:support@blooddonation.com">support@blooddonation.com</a></p>
      </div>
    </body>
    </html>
  `;
};
