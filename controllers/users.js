const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const registerUser = catchAsync(async (req, res) => {
 
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (user) {
        return res.status(409).json({"message": "Email in use"})
    }

    const result = await User.create({ email, password });

    result.password = undefined;

    res.status(201).json({
        user: result
    });
 
});


module.exports = {
  registerUser
}