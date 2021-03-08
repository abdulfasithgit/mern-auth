const { check } = require('express-validator')
//
exports.userSignupValidator = [
  // check('name')
  //     .not()
  //     .isEmpty()
  //     .withMessage('Name is required.'),
  check('email')
    .isEmail()
    .withMessage('Must be valid email address.'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 5 characters.')
]
//
exports.userSigninValidator = [
  // check('name')
  //     .not()
  //     .isEmpty()
  //     .withMessage('Name is required.'),
  check('email')
    .isEmail()
    .withMessage('Must be valid email address.'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 5 characters.')
]

exports.forgotPasswordValidator = [
  check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Must be valid email address.')
]

exports.resetPasswordValidator = [
  check('newPassword')
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 5 characters.')
]
