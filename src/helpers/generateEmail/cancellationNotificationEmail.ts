const cancellationNotificationEmail = (
  recipientName: string,
  donorName: string,
  bloodGroup: string,
  city: string,
  hospitalName: string,
  phoneNumber: string,
  dateOfDonation: string,
  requestId: string,
  isDonor: boolean
) => {
  const subjectText = isDonor
    ? "You Have Cancelled a Blood Donation Request"
    : "Your Blood Donation Request Has Been Cancelled";

  const messageText = isDonor
    ? `You have successfully <strong style="color: red;">cancelled</strong> a blood donation request. If this was a mistake, please contact the recipient as soon as possible.`
    : `Unfortunately, your blood donation request has been <strong style="color: red;">cancelled</strong> by the donor. We understand this may be disappointing, but don't lose hope! You can submit a new request to find another donor.`;

  const actionText = isDonor ? "Manage Requests in Dashboard" : "Find Another Donor";

  const actionLink = isDonor
    ? `http://blood-donation24.netlify.app/my-donate-request`
    : `http://blood-donation24.netlify.app/donors`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subjectText}</title>
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
        font-size: 16px;
        font-weight: 600;
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
      <div class="header">${subjectText}</div>
      <div class="content">
        <img class="logo" src="https://your-logo-url.com/logo.png" alt="Blood Donation">
        <h2>Hello, ${recipientName}</h2>
        <p>${messageText}</p>
        
        <div class="info-box">
          <p><strong>${isDonor ? "Recipient's Name" : "Donor's Name"}:</strong> ${donorName}</p>
          <p><strong>Blood Group:</strong> ${bloodGroup}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Hospital:</strong> ${hospitalName}</p>
          <p><strong>Contact:</strong> ${phoneNumber}</p>
          <p><strong>Planned Donation Date:</strong> ${dateOfDonation}</p>
          <p><strong>Request Id:</strong> ${requestId}</p>
        </div>

        <p>You can manage your request using the button below:</p>
        <a href="${actionLink}" class="button">${actionText}</a>
        
        <p class="footer">Need help? Contact us at <a href="mailto:support@blooddonation.com">support@blooddonation.com</a></p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export default cancellationNotificationEmail;
