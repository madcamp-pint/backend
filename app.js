require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');

const authRoute = require('./src/route/auth-route');

const app = express();
app.use(express.json());

app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const User = require('./src/model/user-model');
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

require('./src/passport/kakao-strategy')(passport);

app.use('/auth', authRoute);

module.exports = app;