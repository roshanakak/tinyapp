const express = require("express");
const {ifEmailExists, ifPasswordMatches, generateRandomString} = require("./helpers");
const {urlDatabase, users} = require("./data");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.post("/login", (req, res) => { // saves the user to a cookie
  const userID = ifPasswordMatches(users, req.body.email, req.body.password);
  if (userID) {
    res.cookie('user_id', userID);
    res.redirect(`/urls`);
  } else {
    res.status(403).json({success: false, error: 'The email or password is not correct!'});
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});

app.post("/register", (req, res) => {
  if (!req.body.password || !req.body.email) {
    res.status(400).json({success: false, error: 'The email or password has not been provided!'});
  } else if (ifEmailExists(users, req.body.email)) {
    res.status(400).json({success: false, error: 'The email already exists!'});
  } else {
    const id = generateRandomString();
    users[id] = {
      id,
      email: req.body.email,
      password: req.body.password
    };
    res.cookie('user_id', id);
    res.redirect(`/urls`);
  }
});

app.post("/urls", (req, res) => { // create new short URL
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: users[req.cookies["user_id"]]
  }
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => { // delete existing URL
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => { // Updates long URL in show a URL page
 urlDatabase[req.params.shortURL] = {
  longURL: req.body.longURL,
  userID: users[req.cookies["user_id"]]
}
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (req.cookies["user_id"]) {  
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };

  res.render("urls_new", templateVars);
} else {
  res.redirect("/login");
}
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
    'shortURL': req.params.shortURL, 'longURL': urlDatabase[req.params.shortURL].longURL
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.status(404).json({success: false, error: 'This short URL does not exist!'});
  } else {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.redirect(urlDatabase[req.params.shortURL].longURL);
}
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("registrationForm", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("loginForm", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});