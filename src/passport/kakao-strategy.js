const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../model/user-model');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: process.env.KAKAO_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    console.log('--- Kakao Strategy Executed ---'); // 1. 전략 실행 확인용 로그
    console.log('Kakao Profile:', profile); // 2. 카카오로부터 받은 프로필 정보 확인용 로그

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
      console.error('--- Kakao Strategy Error ---', err); // 3. 에러 발생 시 강제로 콘솔에 출력
      return done(err);
    }
  }));
};