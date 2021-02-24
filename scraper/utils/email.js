const sgMail = require('@sendgrid/mail')
const { green } = require('chalk')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = async (msg) => {
  try {
    await sgMail.send(msg)
    console.log(green('Email sent'))
  } catch (error) {
    console.log(error)
  }
}
