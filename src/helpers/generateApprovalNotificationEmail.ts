export const generateApprovalNotificationEmail = (
  recipientName: string,
  donorName: string,
  bloodGroup: string,
  location: string,
  hospitalName: string,
  contactNumber: string,
  donationDate: string,
  requestId: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Blood Donation Request Approved</title>
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
          color: #28a745;
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
        .contact-button {
          display: inline-block;
          background: #007bff;
          color: white;
          font-size: 16px;
          font-weight: bold;
          padding: 12px 20px;
          border-radius: 6px;
          margin: 20px 0;
          text-decoration: none;
        }
        .contact-button:hover {
          background: #0056b3;
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
        <h2>Great News! Your Request Has Been Approved</h2>
        <p>Dear <strong>${recipientName}</strong>,</p>
        <p>Your blood donation request has been approved by a donor. Below are the donor details:</p>

        <div class="details">
          <p><strong>Donor Name:</strong> ${donorName}</p>
          <p><strong>Blood Group:</strong> ${bloodGroup}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Hospital:</strong> ${hospitalName}</p>
          <p><strong>Contact Number:</strong> ${contactNumber}</p>
          <p><strong>Donation Date:</strong> ${donationDate}</p>
        </div>

        <p><strong>Please contact the donor as soon as possible to coordinate the donation.</strong></p>

        <p class="footer">Need assistance? Contact us at <a href="mailto:support@blooddonation.com">support@blooddonation.com</a></p>
      </div>
    </body>
    </html>
  `;
};
