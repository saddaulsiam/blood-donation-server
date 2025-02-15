const completeAlertEmail = (
  recipientName: string,
  otherPartyName: string,
  bloodGroup: string,
  location: string,
  hospitalName: string,
  contactNumber: string,
  donationDate: string,
  requestId: string,
  message: string,
  isDonor: boolean
) => {
  const actionLink = isDonor
    ? `https://blood-donation24.netlify.app/my-donate-request`
    : `https://blood-donation24.netlify.app/request-to-donate`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Donation is complete or not</title>
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
          background: ${isDonor ? "#28a745" : "rgb(29, 26, 173)"};
          color: white;
          font-size: 16px;
          font-weight: bold;
          padding: 12px 20px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 15px;
          margin-left:15px;
        }
        .button:hover {
          background: ${isDonor ? "#218838" : "#15108a"};
        }
        .footer {
          font-size: 12px;
          color: #888;
          margin-top: 20px;
        }
        .btn-div {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" src="https://your-logo-url.com/logo.png" alt="Blood Donation">
        <h2>Donation is complete or not</h2>
        <p>${`Dear <strong>${recipientName}</strong>,<br><br> please confirm that your donation complete or not`}</p>
        <div class="details">
          <p><strong>Request ID:</strong> ${requestId}</p>
          <p><strong>${isDonor ? "Requester Name" : "Donor Name"}:</strong> ${otherPartyName}</p>
          <p><strong>Blood Group:</strong> ${bloodGroup}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Hospital:</strong> ${hospitalName}</p>
          <p><strong>Contact:</strong> ${contactNumber}</p>
          <p><strong>Donation Date:</strong> ${donationDate}</p>
        </div>
        <div class="message-box">
          <p><strong>Message:</strong></p>
          <p>"${message}"</p>
        </div>
        <p><strong>Blood Donation is ?</strong></p>
        <div class="btn-div">
          <a href="${actionLink}" class="button">✅ Complete</a>
          <a href="${actionLink}" class="button">❌ Cancel</a>
        </div>
        <p class="footer">For any questions, contact us at <a href="mailto:support@blooddonation.com">support@blooddonation.com</a></p>
      </div>
    </body>
    </html>
  `;
};

export default completeAlertEmail;
