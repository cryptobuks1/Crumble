const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use('/delete', passport.authenticate('jwt', {session: false, failureRedirect: '/api/auth/unauthorized'}, null), require('./delete'));
router.use('/upload', passport.authenticate('jwt', {session: false, failureRedirect: '/api/auth/unauthorized'}, null), require('./upload'));
router.use('/search', passport.authenticate('jwt', {session: false, failureRedirect: '/api/auth/unauthorized'}, null), require('./search'));
router.use('/sign', passport.authenticate('jwt', {session: false, failureRedirect: '/api/auth/unauthorized'}, null), require('./sign'));
router.use('/:id', require('./get'));

module.exports = router;
