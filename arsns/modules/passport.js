const KakaoStrategy = require('passport-kakao').Strategy;
const passportKey = require('../config/passportKey');
const authService = require('../services/authService');
const User = require('../models/user');
const encrypt = require('./encrypt');
let passport = require('passport');


passport.use(new KakaoStrategy({
    clientID: passportKey.federation.kakao.ID,
    clientSecret: passportKey.federation.kakao.KEY,
    profileFields: ['id', 'displayName', 'email'],
    callbackURL: 'http://localhost:3000/auth/kakao/callback'
},

async (accessToken, refreshToken, profile, done) => {
    const socialId = 'kakao:' + profile.id;
    const nickname = profile.displayName;
    const email = profile.emails[0].value;
    const user = await authService.findOrCreate(socialId, nickname, email);
    done(null, user);
}
));