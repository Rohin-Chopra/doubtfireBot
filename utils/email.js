const nodemailer = require('nodemailer')
const { green } = require('chalk')

module.exports = (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log(green('Email sent: ' + info.response))
    }
  })
}
