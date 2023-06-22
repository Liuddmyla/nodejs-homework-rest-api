const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (data) => {
    
    const email = { ...data, from: "liuda.gladkovych@gmail.com" };

    try {        
        await sgMail.send(email);
        console.log("send");
        return true;
    } catch (error) {
        console.log("error-send");
        throw error;
    }    
}

module.exports = sendEmail;

