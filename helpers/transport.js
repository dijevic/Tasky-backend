const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAILUSER, // generated ethereal user
        pass: process.env.EMAILTRANSPORTERKEY, // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
    }
});


transporter.verify().then(() => {
    console.log('ready for sending emails')
})

module.exports = transporter