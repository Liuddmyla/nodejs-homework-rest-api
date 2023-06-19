const express = require('express');
const {registerUser} = require('../../controllers/users');
const { checkCreateUserData } = require('../../middlewares/userMiddlewares');

const router = express.Router();

router.post('/', checkCreateUserData, registerUser);

module.exports = router