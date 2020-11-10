const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/login', require('./login'));
router.use('/user', passport.authenticate('jwt', {session: false, failureRedirect: '/api/auth/unauthorized'}, null), require('./user'));
router.use('/unauthorized', require('./unauthorized'));

module.exports = router;
