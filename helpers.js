const ifEmailExists = function(usersData, email) {
  for (const user in usersData) {
    if (email === usersData[user].email) {
      return true;
    }
  }
  return false; 
}

const ifPasswordMatches = function(usersData, email, password) {
  for (const user in usersData) {
    if (email === usersData[user].email && password === usersData[user].password) {
      return user;
    }
  }
  return false; 
}

const generateRandomString = function() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() *
charactersLength));
  }
  return result;
}

module.exports = {ifEmailExists, ifPasswordMatches, generateRandomString}