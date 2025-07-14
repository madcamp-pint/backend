const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

require('dotenv').config();

const authRoute = require('./src/route/auth-route');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false // 로컬에서는 false
  }
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