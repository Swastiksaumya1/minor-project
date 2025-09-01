const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

const dbPath = './assets/db/woodex.db';
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        db.serialize(() => {
            db.run("DROP TABLE IF EXISTS users"); // Drop the table if it exists
            db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT, phone TEXT, address TEXT)");
        });
    }
});

passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(token, tokenSecret, profile, done) {
    return done(null, profile);
  }
));

passport.use(new FacebookStrategy({
    clientID: 'YOUR_FACEBOOK_CLIENT_ID',
    clientSecret: 'YOUR_FACEBOOK_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/auth/facebook',
  passport.authenticate('facebook')
);

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.post('/api/signup', (req, res) => {
  const { email, password, phone, address } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run("INSERT INTO users (email, password, phone, address) VALUES (?, ?, ?, ?)", [email, hashedPassword, phone, address], function(err) {
    if (err) {
      return res.status(500).send('Error saving user');
    }
    res.send('User registered successfully');
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      return res.status(500).send('Error retrieving user');
    }
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).send('Error comparing passwords');
      }
      if (!isMatch) {
        return res.status(401).send('Invalid email or password');
      }
      req.session.user = user;
      res.send('Login successful');
    });
  });
});

app.post('/api/user', (req, res) => {
  const { email, phone, address } = req.body;
  db.run("UPDATE users SET phone = ?, address = ? WHERE email = ?", [phone, address, email], function(err) {
    if (err) {
      return res.status(500).send('Error updating user');
    }
    res.send('User updated successfully');
  });
});

app.get('/api/user/:email', (req, res) => {
  db.get("SELECT * FROM users WHERE email = ?", [req.params.email], (err, user) => {
    if (err) {
      return res.status(500).send('Error retrieving user');
    }
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  });
});

app.use(express.static(path.join(__dirname, 'client')));

app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
