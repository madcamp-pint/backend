const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../model/user-model');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: process.env.KAKAO_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ kakaoId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      } else {
        const newUser = new User({
          kakaoId: profile.id,
          nickname: profile.username || profile.displayName,
          email: profile._json?.kakao_account?.email,
          profileImage: profile._json?.properties?.profile_image,
        });

        await newUser.save();
        return done(null, newUser);
      }
    } catch (err) {
      return done(err);
    }
  }));
};