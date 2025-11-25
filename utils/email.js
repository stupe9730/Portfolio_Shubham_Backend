const nodemailer = require("nodemailer");

const sendEmail = ({
  to = process.env.FROM_EMAIL,
  message = "test email",
  subject = "test subject",
  isHtml = true,
}) =>
  new Promise((resolve, reject) => {
    try {
      const mailer = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.FROM_EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      });

      console.log("Sending email to:", to);

      mailer.sendMail(
        {
          to,
          from: process.env.FROM_EMAIL,
          subject,
          [isHtml ? "html" : "text"]: message, // ✅ dynamic key
        },
        (err) => {
          if (err) {
            console.error("Email send error:", err);
            return reject(err);
          } else {
            console.log("✅ Email sent successfully!");
            return resolve("Email sent successfully!");
          }
        }
      );
    } catch (error) {
      console.error("Send email error:", error);
      return reject(error.message);
    }
  });

module.exports = sendEmail;
