const crypto = require('crypto')
const { database } = require('../config/db.js')
var moment = require('moment-timezone')
var CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
const expressJwt = require('express-jwt')
const { OAuth2Client } = require('google-auth-library')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//const User = require('../models/user.model')
//mysql
var salt = make_salt()
// exports.signup = (req, res) => {

//     const data = req.body;
//     //console.log(data.password);
//     database
//         .table('users')
//         .filter({ email: data.email })
//         .get()
//         .then(doc => {
//             if (doc) {
//                 return res.status(400).json({
//                     error: "Email is taken"
//                 })
//             }
//         })

//     // data.last_name = data.last_name;
//     // data.salt = salt;
//     // //console.log("data.salt",data.salt);
//     // data.status = '1';
//     var _password = encrypt_password(data.password);
//     //console.log("pass", _password);
//     // data.created_on_utc = moment().tz("UTC").format('YYYY-MM-DD hh:mm:ss');
//     // console.log(data);
//     // database
//     //     .table('users')
//     //     .insert({
//     //         first_name: data.first_name,
//     //         last_name: data.last_name,
//     //         email: data.email,
//     //         salt: salt,
//     //         password: _password,
//     //         created_on_utc: moment().tz("UTC").format('YYYY-MM-DD hh:mm:ss'),
//     //         hash_id: make_salt()
//     //     }).then(lastId => {
//     //         console.log(lastId)
//     //         if (lastId) {
//     //             res.json({
//     //                 message: "Signup Success!"
//     //             })
//     //         }
//     //     }).catch(err => {
//     //         console.log('SIGNUP ERROR', err)
//     //     })
//     //console.log(_password);
//     //console.log(this.salt);

//     //console.log(moment().tz("UTC").format('YYYY MM DD hh:mm:ss'));
// }
//mongo db
// exports.signup = (req, res) => {

//     const { name, email, password } = req.body;
//     User.findOne({ email }).exec((err, user) => {
//         if (user) {
//             return res.status(400).json({
//                 error: "Email is taken"
//             })
//         }
//     })
//     let newUser = new User({ name, email, password });
//     newUser.save((err, success) => {
//         if (err) {
//             console.log('SIGNUP ERROR', err);
//             return res.status(400).json({
//                 error: err
//             })
//         }
//         res.json({
//             message: "Signup Success!"
//         })
//     })
// }
//
exports.signup = (req, res) => {
  const data = req.body
  //console.log(data.password);
  database
    .table('users')
    .filter({ email: data.email })
    .get()
    .then(doc => {
      if (doc) {
        return res.status(400).json({
          error: 'Email is taken'
        })
      }
    })
  //console.log(data.name);
  const token = jwt.sign(
    {
      first_name: data.name,
      last_name: data.name,
      password: data.password,
      email: data.email
    },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: '30m' }
  )
  const emailData = {
    from: process.env.EMAIL_FROM,
    to: data.email,
    subject: 'Account Activation Link',
    html: `
            <h1> Please use the following link to activate your account' </h1>,
            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>${process.env.CLIENT_URL}</p>
        `
  }
  sgMail
    .send(emailData)
    .then(sent => {
      return res.json({
        message: `Email has been sent to ${data.email}. Follow the instructions to activate the account.`
      })
    })
    .catch(err => {
      return res.json({
        message: err.message
      })
    })
}
exports.accountActivation = (req, res) => {
  const { token } = req.body
  console.log(token)
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
      err,
      decoded
    ) {
      if (err) {
        console.log('ERROR IN JWT VERIFY FOR ACCOUNT ACTIVATION')
        return res.status(401).json({
          error: 'Expired link. Signup again'
        })
      }
      //
      var decoded_data = jwt.decode(token)
      var _password_ = encrypt_password(decoded_data.password)
      database
        .table('users')
        .insert({
          first_name: decoded_data.first_name,
          last_name: decoded_data.last_name,
          email: decoded_data.email,
          salt: salt,
          password: _password_,
          created_on_utc: moment()
            .tz('UTC')
            .format('YYYY-MM-DD hh:mm:ss'),
          hash_id: make_salt()
        })
        .then(lastId => {
          if (lastId) {
            return res.json({
              message: 'Signup Success!'
            })
          }
        })
        .catch(err => {
          console.log('SIGNUP ERROR', err)
          return res.status(401).json({
            error: 'Error in saving database.'
          })
        })
    })
  } else {
    return res.json({
      message: 'Something went wrong. Try again.'
    })
  }
}
//
// function save_users(data) {

//     var output = {
//         status: "",
//         message: "",
//         status_code: ""
//     }
//     //console.log(data)
//     var _password_ = encrypt_password(data.password);
//     if (data) {
//         database
//             .table('users')
//             .insert({
//                 first_name: data.first_name,
//                 last_name: data.last_name,
//                 email: data.email,
//                 salt: salt,
//                 password: _password_,
//                 created_on_utc: moment().tz("UTC").format('YYYY-MM-DD hh:mm:ss'),
//                 hash_id: make_salt()
//             }).then(lastId => {

//                 if (lastId) {
//                     console.log("first loop", output);
//                     output.status = "success";
//                     output.message = "Signup Success";
//                     console.log("success lop", output);
//                     return output;
//                 }
//             }).catch(err => {
//                 console.log('SIGNUP ERROR', err)
//                 // return res.status(401).json({
//                 //     error: "Error in saving database."
//                 // })
//                 console.log("error loop");
//                 //output.message = "Error in saving database.";
//                 output.status_code = "401";
//                 return output

//             })
//         console.log("save users function", output);
//         return output;
//     }

// }
//
exports.signin = (req, res) => {
  const data = req.body
  //console.log(data.password);
  database
    .table('users')
    .filter({ email: data.email })
    .get()
    .then(user => {
      if (!user) {
        return res.status(400).json({
          error: 'Invalid credentials. Please Signup!'
        })
      }
      //authenticate
      if (authenticate(user.salt, user.password, data.password)) {
        return res.status(400).json({
          error: 'Email or password didnt match'
        })
      }
      //token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7days'
      })
      const { id, first_name, email, user_role } = user
      return res.json({
        token,
        user: { id, first_name, email, user_role }
      })
    })
    .catch(err => {
      console.log('SIGNIN ERROR', err)
      return res.status(400).json({
        error: 'Error in database.'
      })
    })
}
function authenticate (salt, password, entered_pass) {
  var get_encrypted = CryptoJS.AES.encrypt(password, salt).toString()
  return get_encrypted == entered_pass
}
//
function encrypt_password (password) {
  console.log('encrypt_password', password)
  if (!password) return ''
  //console.log(salt);
  var hashed = CryptoJS.AES.encrypt(password, salt).toString()
  //console.log("hashed_salt", hashed);
  return hashed
}
//
function make_salt () {
  return Math.round(new Date().valueOf() * Math.random()) + ''
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
})

exports.adminMiddleware = (req, res, next) => {
  const userId = req.params.id
  database
    .table('users')
    .withFields(['id', 'first_name', 'last_name', 'email', 'user_role'])
    .filter({ id: userId })
    .get()
    .then(result => {
      if (!result) {
        return res.status(400).json({
          error: 'User not found'
        })
      }
      if (result.user_role != 'A') {
        return res.status(400).json({
          error: 'Admin resource. Access denied'
        })
      }
      req.profile = result
      next()
    })
}

exports.forgotPassword = (req, res) => {
  const { email } = req.body
  database
    .table('users')
    .withFields(['id', 'first_name'])
    .filter({ email: email })
    .get()
    .then(result => {
      if (!result) {
        return res.status(400).json({
          error: 'User not found'
        })
      }
      console.log(result.first_name)
      const token = jwt.sign(
        {
          id: result.id,
          name: result.first_name
        },
        process.env.JWT_RESET_PASSWORD,
        { expiresIn: '10m' }
      )
      database
        .table('users')
        .filter({ id: result.id })
        .update({
          forgot_request: token
        })
        .then(successNum => {
          if (successNum) {
            const emailData = {
              from: process.env.EMAIL_FROM,
              to: email,
              subject: 'Password Reset Link',
              html: `
                          <h1> Please use the following link to reset your password' </h1>,
                          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                          <hr />
                          <p>This email may contain sensitive information</p>
                          <p>${process.env.CLIENT_URL}</p>
                      `
            }
            sgMail
              .send(emailData)
              .then(sent => {
                return res.json({
                  message: `Email has been sent to ${email}. Follow the instructions to reset your account.`
                })
              })
              .catch(err => {
                return res.json({
                  message: err.message
                })
              })
          } else {
            console.log('PASSWORD RESET ERROR1')
          }
        })
        .catch(err => {
          console.log('PASSWORD RESET ERROR', err)
          return res.status(400).json({
            error: 'Database connection error on reset password'
          })
        })
    })
}

exports.resetPassword = (req, res) => {
  // console.log("req", req.body);
  const { forgot_request, newPassword } = req.body
  if (forgot_request) {
    jwt.verify(forgot_request, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(400).json({
          error: 'Expired Link.Try again'
        })
      }
    })
  } else {
    return res.status(400).json({
      error: 'No Access'
    })
  }
  database
    .table('users')
    .withFields(['id'])
    .filter({ forgot_request: forgot_request })
    .get()
    .then(result => {
      if (!result) {
        return res.status(400).json({
          error: 'User not found'
        })
      }
      database
        .table('users')
        .filter({ id: result.id })
        .update({
          password: newPassword,
          forgot_request: ''
        })
        .then(successNum => {
          if (successNum) {
            res.json({
              message: 'Now you can login with your new password!'
            })
          } else {
            console.log('PASSWORD UPDATE ERROR1')
          }
        })
        .catch(err => {
          console.log('PASSWORD UPDATE ERROR', err)
          return res.status(400).json({
            error: 'Database connection error on update password'
          })
        })
    })
}
//
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req, res) => {
  const { idToken } = req.body
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then(response => {
      console.log(response)
      const { email_verified, name, email } = response.payload
      if (email_verified) {
        database
          .table('users')
          .withFields(['id', 'first_name', 'email', 'user_role'])
          .filter({ email: email })
          .get()
          .then(result => {
            if (result) {
              const token = jwt.sign(
                { id: result.id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              )
              const { id, first_name, email, user_role } = result
              return res.json({
                token,
                user: { id, first_name, email, user_role }
              })
            } else {
              let password = email + process.env.JWT_SECRET
              database
                .table('users')
                .insert({
                  first_name: response.payload.given_name,
                  last_name: response.payload.family_name,
                  email: email,
                  salt: salt,
                  password: password,
                  created_on_utc: moment()
                    .tz('UTC')
                    .format('YYYY-MM-DD hh:mm:ss'),
                  hash_id: make_salt()
                })
                .then(lastId => {
                  if (lastId) {
                    const token = jwt.sign(
                      { id: lastId },
                      process.env.JWT_SECRET,
                      { expiresIn: '7d' }
                    )
                    const userData ={
                      id: lastId,
                      first_name: response.payload.name,
                      email: email,
                      user_role : 'A'
                    }
                    var id = lastId;
                    var first_name = response.payload.name;
                    var email = email;
                    var user_role = 'A';
                    return res.json({
                      token,
                      user:  {id, first_name, email, user_role}
                    })
                  }
                })
                .catch(err => {
                  console.log('SIGNUP ERROR', err)
                  return res.status(401).json({
                    error: 'Error in saving database.'
                  })
                })
            }
          })
          .catch(err => {
            console.log('SIGNUP ERROR', err)
            return res.status(401).json({
              error: 'Error in Google login.'
            })
          })
      }
    })
}
