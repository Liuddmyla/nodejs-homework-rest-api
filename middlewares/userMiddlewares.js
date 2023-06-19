const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { userDataValidator } = require('../utils/userValidators');



exports.checkCreateUserData = catchAsync(async (req, res, next) => {

  const { error, value } = userDataValidator(req.body);

  if (error) return next(new AppError(400, 'Bad Request'));

  const userExists = await User.exists({ email: value.email });

  if (userExists) return next(new AppError(409, 'Email in use'));

  req.body = value;

  next();
});
