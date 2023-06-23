const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendEmail = async (data) => {
    
    const email = { ...data, from: "liuda.gladkovych@gmail.com" };

    try {        
        await sgMail.send(email);        
        return true;
    } catch (error) {
        return error.message;        
    }    
}

module.exports = sendEmail;

