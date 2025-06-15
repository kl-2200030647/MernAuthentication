import nodemailer from 'nodemailer';

//here we have to give stmp username and password to send mail 
const transporter=nodemailer.createTransport({
    host:'smtp-relay.brevo.com',
    port:587,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS,
    }

});
export default transporter;