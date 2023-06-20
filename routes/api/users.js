const express = require('express');
const {registerUser, loginUser, currentUser} = require('../../controllers/users');
const { checkCreateUserData, auht } = require('../../middlewares/userMiddlewares');

const router = express.Router();

router.post('/register', checkCreateUserData, registerUser);

router.post('/login', checkCreateUserData, loginUser);

router.get('/current', auht, currentUser);

module.exports = router