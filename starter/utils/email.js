const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

//new email(user,url).sendWelcome()

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Samir Shrestha <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  //send actual email
  async send(template, subject) {
    //1)render the html template from pug
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      },
    );

    //2)define email options
    const mailoption = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    //3) create transport and send email
    await this.newTransport().sendMail(mailoption);
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to Natours Family');
  }
  async sendPasswordReset() {
    await this.send(
      'resetPassword',
      'Your password reset token(valid for only 10 minutes',
    );
  }
};
