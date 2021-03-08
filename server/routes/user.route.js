const express = require('express');
const router = express.Router();
//import controllers
const { requireSignin, adminMiddleware }= require('../controllers/auth.controller');
const { read, update }= require('../controllers/user.controller');

router.get('/user/:id', requireSignin, read);
router.put('/user/update/:id', requireSignin, update);
router.put('/admin/update/:id', requireSignin, adminMiddleware, update);
//
module.exports = router;