const express = require('express');
const {registerUser, loginUser} = require('../../controllers/users');
const { checkCreateUserData } = require('../../middlewares/userMiddlewares');

const router = express.Router();

router.post('/register', checkCreateUserData, registerUser);

router.post('/login', checkCreateUserData, loginUser);

module.exports = router