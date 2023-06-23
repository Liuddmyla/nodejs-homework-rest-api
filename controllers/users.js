const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const jimp = require('jimp');
const uuid = require('uuid').v4;
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const { sendEmail } = require('../helpers/sendEmail');


const registerUser = catchAsync(async (req, res) => {
 
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (user) {
        return res.status(409).json({"message": "Email in use"})
    }

    const avatarURL = gravatar.url(email);

    const verificationToken = uuid();

    const result = await User.create({ email, password, avatarURL, verificationToken });

    const mail = {
        to: email,
        subject: "Підтвердження реєстрації",
        html:`<a href="http://localhost:3000/users/verify/${verificationToken}" target="_blank">Натисніть для підтвердження пошти</a>`
    }

    await sendEmail(mail);
    
    res.status(201).json({
        user: result
    });
 
});


const loginUser = catchAsync(async (req, res) => {
 
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    const match = await bcrypt.compare(password, user.password);    
        
    if (!user || !match) {
        return res.status(401).json({"message": "Email or password is wrong"})
    }

    if (!user.verify) {
        return res.status(401).json({ "message": "Email not verify" });
    }

    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });

   
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
        token,
        user
    });
 
});


const currentUser = catchAsync(async (req, res) => {
 
    const { email, subscription } = req.user;

    res.status(200).json({        
        user:{email, subscription}
    });
 
});


const logoutUser = catchAsync(async (req, res) => {
 
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: null });

    res.status(204).json();
 
});


const avatarDir = path.join(__dirname, "../", "public", "avatars");

const updateAvatar = async (req, res) => {

    const { path: tempUpload, originalname } = req.file;
    const { _id: id } = req.user;
    const imageName = `${id}_${originalname}`;
    
    try {      

        const resultUpload = path.join(avatarDir, imageName);

        await jimp.read(tempUpload).then((img) => {
            return img.resize(250, 250).write(resultUpload);
        });

        // await fs.rename(tempUpload, resultUpload);

        const avatarURL = path.join("public", "avatars", imageName);

        await User.findByIdAndUpdate(req.user._id, { avatarURL });

        res.status(200).json({avatarURL});

    } catch (error) {
        
        await fs.unlink(tempUpload);
        throw error;
 } 
};

const verifyEmail = catchAsync(async (req, res) => {
 
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });

    if (!user) {
        return res.status(404).json({"message": "User not found"})
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

    res.status(200).json({ "message": "Verification successful" });    
 
});


const resendVerifyEmail = catchAsync(async (req, res) => {
 
    const { email } = req.body;
    
    const user = await User.findOne({ email });   

    if (!email) {
       return res.status(400).json({"message": "missing required field email"}) 
    }

    if (!user) {
      return res.status(404).json({"message": "Not found"})  
    }

    if (user.verify) {
        return res.status(400).json({"message": "Verification has already been passed"})  
    }

    const mail = {
        to: email,
        subject: "Підтвердження реєстрації",
        html:`<a href="http://localhost:3000/users/verify/${user.verificationToken}" target="_blank">Натисніть для підтвердження пошти</a>`
    }

    await sendEmail(mail);

    res.status(200).json({ "message": "Verification email sent" });
 
});


module.exports = {
    registerUser,
    loginUser,
    currentUser,
    logoutUser,
    updateAvatar,
    verifyEmail,
    resendVerifyEmail
}