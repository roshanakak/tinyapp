const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

app.post("/login", (req, res) => { // saves the username to a cookie
  res.cookie('username', req.body.username);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {  
  res.clearCookie('username');
  res.redirect(`/urls`);
});

app.post("/urls", (req, res) => { // create new short URL
let shortURL = generateRandomString();
urlDatabase[shortURL] = req.body.longURL;
res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => { // delete existing URL
delete urlDatabase[req.params.shortURL];
res.redirect("/urls"); 
});

app.post("/urls/:shortURL", (req, res) => { // Update long URL in show a URL page
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };

  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    'shortURL': req.params.shortURL, 'longURL': urlDatabase[req.params.shortURL] 
  };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };

  res.redirect(urlDatabase[req.params.shortURL]);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});