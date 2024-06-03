const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(recipient, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SERVER_EMAIL_ADDRESS,
        pass: process.env.SERVER_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SERVER_EMAIL_ADDRESS,
      to: recipient,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = {
  sendEmail,
};
