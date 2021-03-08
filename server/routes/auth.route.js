const express = require('express');
const router = express.Router();
//import controllers
const { signup, accountActivation, signin, forgotPassword, resetPassword, googleLogin }= require('../controllers/auth.controller');
//import validators
const { userSignupValidator,  userSigninValidator, forgotPasswordValidator, resetPasswordValidator} = require('../validators/auth.validator');
const { runValidation } = require('../validators');

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/account-activation', accountActivation);
router.post('/signin', userSigninValidator, runValidation, signin);
//forgot password
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
//google-login
router.post('/google-login', googleLogin);
//
module.exports = router;