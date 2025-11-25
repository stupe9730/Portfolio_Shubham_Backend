const Portfolio = require("../model/Portfolio");
const sendEmail = require("../utils/email");

exports.contactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // ✅ Email to Admin (You)
    const x = await sendEmail({
      subject: `${subject}`,
      message: `
        <div style="font-family: Arial, sans-serif; color: #333; background: #f7f7f7; padding: 20px;">
          <div style="max-width: 600px; background: white; margin: auto; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 20px;">
            <h2 style="color: #007BFF;">📩 New Message Received!</h2>
            <p><strong>User Name:</strong> ${name}</p>
            <p><strong>User Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f0f0f0; padding: 10px; border-radius: 6px;">
              ${message}
            </div>
            <hr style="margin: 20px 0;">
            <p style="text-align:center; color: #888;">Sent via Portfolio Contact Form</p>
          </div>
        </div>
      `,
      isHtml: true,
    });

    // ✅ Auto Reply to User
    const y = await sendEmail({
      to: email,
      subject: "Thanks for contacting!",
      message: `
        <div style="font-family: Arial, sans-serif; color: #333; background: #eef2f7; padding: 20px;">
          <div style="max-width: 600px; background: white; margin: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 20px;">
            <h2 style="color: #28a745;">🙏 Thank You, ${name}!</h2>
            <p>We’ve received your message with the subject: <strong>${subject}</strong></p>
            <p>I truly appreciate you taking the time to reach out. I’ll get back to you as soon as possible.</p>
            <p style="margin-top:20px;">📞 <strong>Mobile:</strong> 7498187088</p>
            <p style="margin-top:20px;">Best Regards,<br><strong style="color:#007BFF;">Shubham Tupe 😎</strong></p>
            <hr style="margin: 20px 0;">
            <p style="text-align:center; color: #888;">This is an automated response from Shubham’s Portfolio</p>
          </div>
        </div>
      `,
      isHtml: true,
    });

    // ✅ Save in DB if both mails sent successfully
    if (x && y) {
      await Portfolio.create({ name, email, message, subject });
      res.status(200).json({ message: "Stylish emails sent successfully ✅" });
    } else {
      res.status(400).json({ message: "Unable to send email ❌" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

exports.getEmailContact = async (req, res) => {
  try {
    const result = await Portfolio.find();
    console.log(result);
    res.status(200).json({ message: "Get EmailContact Success", result });
  } catch (error) {
    res.status(500).json({ message: error.message || "something went wrong" });
  }
};
exports.deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Portfolio.findByIdAndDelete(id);
    console.log(result);
    res.status(200).json({ message: "Get EmailContact Success" });
  } catch (error) {
    res.status(500).json({ message: error.message || "something went wrong" });
  }
};
