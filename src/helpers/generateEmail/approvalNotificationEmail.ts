const approvalNotificationEmail = (
  recipientName: string,
  donorName: string,
  bloodGroup: string,
  location: string,
  hospitalName: string,
  contactNumber: string,
  donationDate: string,
  requestId: string,
  isDonor: boolean // Differentiates between donor and requester
) => {
  const subjectText = isDonor
    ? "You Have Approved a Blood Donation Request!"
    : "Great News! Your Blood Donation Request Was Approved";

  const messageText = isDonor
    ? `Dear <strong>${recipientName}</strong>,<br><br>
        Thank you for stepping up to save a life! You have successfully <strong style="color: green;">approved</strong> a blood donation request. Below are the details of the recipient:`
    : `Dear <strong>${recipientName}</strong>,<br><br>
        Amazing news! A generous donor has <strong style="color: green;">approved</strong> your blood donation request. Here are their details:`;

  const actionText = isDonor ? "View Request in Dashboard" : "Contact Donor Now";

  const actionLink = isDonor
    ? `http://blood-donation24.netlify.app/my-donate-request`
    : `http://blood-donation24.netlify.app/request-to-donate`;
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
        .header {
          background: #28a745;
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
        .button {
          display: inline-block;
          background: #28a745;
          color: white;
          font-size: 16px;
          font-weight: bold;
          padding: 12px 20px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 15px;
        }
        .button:hover {
          background:rgb(26, 217, 70);
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
          <p>${messageText}</p>

          <div class="details">
            <p><strong>${isDonor ? "Recipient's Name" : "Donor's Name"}:</strong> ${donorName}</p>
            <p><strong>Blood Group:</strong> ${bloodGroup}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Hospital:</strong> ${hospitalName}</p>
            <p><strong>Contact Number:</strong> ${contactNumber}</p>
            <p><strong>Donation Date:</strong> ${donationDate}</p>
            <p><strong>Request Id:</strong> ${requestId}</p>
          </div>

          <p><strong>${
            isDonor
              ? "You can manage this request in your dashboard."
              : "Please reach out to your donor to coordinate the donation."
          }</strong></p>

          <a href="${actionLink}" class="button">${actionText}</a>
          
          <p class="footer">Need help? Contact us at <a href="mailto:support@blooddonation.com">support@blooddonation.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default approvalNotificationEmail;
