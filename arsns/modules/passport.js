const KakaoStrategy = require('passport-kakao').Strategy;
const passportKey = require('../config/passportKey');
const userController = require('../controllers/user');
const User = require('../models/user');
// const encrypt = require('./encrypt');
let passport = require('passport');
const kakaoFriend = require('../modules/kakaoFriend');
const MainModel = require('../models/main');


passport.use(new KakaoStrategy({
    clientID: passportKey.federation.kakao.ID,
    clientSecret: passportKey.federation.kakao.KEY,
    // profileFields: ['id', 'displayName', 'email'],
    // callbackURL: 'http://localhost:3000/users/kakao/callback'
    callbackURL: 'http://3.34.20.225:3000/users/kakao/callback'
},

async (accessToken, refreshToken, profile, done) => {
    const socialId = profile.id;
    const nickname = profile.displayName;
    const email = profile._json.kakao_account.email;
    const at = accessToken;
    console.log('at 1: ', at);
    const user = await userController.findOrCreate(socialId, nickname, email, at);
    // const friend = await userController.getKakaoFriend(at);     
    const friend = await kakaoFriend.getKakaoFriend(at);
    // console.log('친구목록: ',friend.elements);
    // const friendResult = await MainModel.updateFriend(friend);
    done(null, user);
}
));

passport.serializeUser(async (user, done) => {
    console.log('serializeUser', user.id);
    // done 의 두 번째 인자로 user를 구분해줄 수 있는 값인 id를 넣어줌
    done(null, JSON.parse(JSON.stringify(user.id)));
});

passport.deserializeUser(async (id, done) => {
    // 다시 들어오면 serializeUser의 done 의 두 번째 인자로 넘어온 id를 첫 번째 인자로 받아 사용
    console.log('deserializeUser', id);
    const user = await User.getUserById(id);
    // console.log('있어이미~', JSON.parse(JSON.stringify(user)));
    if (user) {
        return done(null, user);
    }
    done('There is no user.');
});