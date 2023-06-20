const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { userDataValidator } = require('../utils/userValidators');



exports.checkCreateUserData = catchAsync(async (req, res, next) => {

  const { error, value } = userDataValidator(req.body);

  if (error) return next(new AppError(400, 'Bad Request'));  

  req.body = value;

  next();
});
