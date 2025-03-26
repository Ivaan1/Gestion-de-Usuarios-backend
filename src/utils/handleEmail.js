require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });

    try{

        

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
            console.error("Detailed OAuth Error:", {
                message: err.message, 
            });
            reject("Failed to create access token.");
        }
        resolve(token);
    });
    });

    

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    return transporter;
    } catch (error) {
        console.error("Complete OAuth Setup Error:", error);
        throw error;
    }
};

const sendEmail = async (emailOptions) => {
    try {
        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
    } catch (e) {
        console.log(e)
    }
};

module.exports = { sendEmail }