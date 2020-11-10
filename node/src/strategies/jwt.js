const {Strategy, ExtractJwt} = require('passport-jwt');
const config = require('../../config');
const secret = config.secret || "default secret";
const User = require('../models/User');
const Power = require('express-power');

module.exports = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
}, (payload, done) => {
    Power.log(`jwt auth user ${payload.username}`);
    User.findById(payload.id)
        .then(user => {
            Power.log(`jwt auth user ${payload.username} ok`);
            if (user) {
                return done(null, {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: user.roles,
                    firstName: user.firstName,
                    lastName: user.lastName,
                });
            }
            Power.log(`jwt auth user ${payload.username} failed`);
            return done(null, false);
        }).catch(err => {
            console.error(err);
            Power.log(`jwt auth user ${payload.username} error`.red);
    });
})
