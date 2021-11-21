const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env

const oauth2Client = new OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)

// send mail
const sendEmail = (to, url, txt) => {
    oauth2Client.setCredentials({
        refresh_token: GOOGLE_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            refreshToken: GOOGLE_REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: `${txt}`,
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: #2a2a2a;">Welcome to the Edar DarCom website.</h2>
            <p>Congratulations! You're almost set to start using Edar DarCom App.
                Just click the button below to ${txt}.
            </p>
            
            <a href=${url} style="background: #ee5057; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
        `
    }

    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if (err) return err;
        return infor
    })
}

module.exports = sendEmail