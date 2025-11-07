const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  //1)create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) define email option
  const mailoption = {
    from: 'samir shrestha <karunassamir7s@gmail.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3)actually send email
  await transporter.sendMail(mailoption);
};

module.exports = sendEmail;
