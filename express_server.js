const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const {getUserByEmail, urlsForUser} = require("./helpers/users");
const generateRandomString = require("./helpers/general");
const generateAuthenticator = require("./helpers/authentication");
const {urlDatabase, users} = require("./data");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['RandomKey159'],
  maxAge: 1 * 60 * 60 * 1000 // 1 hour
}));

app.use('/', generateAuthenticator());

app.post("/login", (req, res) => { // saves the user to a cookie
  res.clearCookie('error');
  const user = getUserByEmail(users, req.body.email, req.body.password);
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    req.session.user_id =  user.id;
    res.redirect(`/urls`);
  } else {
    res.cookie('error', 'Error 403: The email or password is not correct!');
    res.redirect('/login');
  }
});

app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.render("emptyPage");
});

app.post("/register", (req, res) => {
  res.clearCookie('error');
  if (!req.body.password || !req.body.email) {
    res.cookie('error', 'Error 400: The email or password has not been provided!');
    res.redirect('/register');
  } else if (getUserByEmail(users, req.body.email)) {
    res.cookie('error', 'Error 400: The email already exists!');
    res.redirect('/register');
  } else {
    const id = generateRandomString();
    users[id] = {
      id,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session.user_id =  id;
    res.redirect(`/urls`);
  }
});

app.post("/urls", (req, res) => { // create new short URL
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: users[req.session.user_id].id
  };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => { // delete existing URL
  res.clearCookie('error');
  const urls = urlsForUser(urlDatabase, req.session.user_id);
  if (!urls[req.params.shortURL]) {
    res.cookie('error', 'Error 400: This URL does not belong to you.');
    res.redirect('/urls');
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});

app.post("/urls/:shortURL", (req, res) => { // Updates long URL in show a URL page
  res.clearCookie('error');
  const urls = urlsForUser(urlDatabase, req.session.user_id);
  if (!urls[req.params.shortURL]) {
    res.cookie('error', 'Error 400: This URL does not belong to you.');
    res.redirect('/urls');
  } else {
    urlDatabase[req.params.shortURL] = {
      longURL: req.body.longURL,
      userID: users[req.session.user_id].id
    };
    res.redirect(`/urls/${req.params.shortURL}`);
  }
});

app.get("/urls", (req, res) => {
  res.clearCookie('error');
  const templateVars = {
    user: users[req.session.user_id],
    urls: urlsForUser(urlDatabase, req.session.user_id),
    error: req.cookies.error ? req.cookies.error : null
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    error: req.cookies.error ? req.cookies.error : null
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  res.clearCookie('error');
  const urls = urlsForUser(urlDatabase, req.session.user_id);
  if (!urls[req.params.shortURL]) {
    res.cookie('error', 'Error 400: This URL does not belong to you.');
    res.redirect('/urls');
  } else {
    const templateVars = {
      user: users[req.session.user_id],
      'shortURL': req.params.shortURL, 'longURL': urls[req.params.shortURL],
      error: req.cookies.error ? req.cookies.error : null
    };
    res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  res.clearCookie('error');
  if (!urlDatabase[req.params.shortURL]) {
    res.cookie('error', 'Error 404: This short URL does not exist!');
    res.redirect('/urls');
  } else {
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  }
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    error: req.cookies.error ? req.cookies.error : null
  };
  res.render("registrationForm", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
    error: req.cookies.error ? req.cookies.error : null
  };
  res.render("loginForm", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});