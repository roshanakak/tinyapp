const getUserByEmail = function(usersData, email) {
  for (const user in usersData) {
    if (email === usersData[user].email) {
      return usersData[user];
    }
  }
  return false;
};

const urlsForUser = function(data, userID) {
  const outputData = {};
  for (const element in data) {
    if (data[element].userID === userID) {
      outputData[element] = data[element].longURL;
    }
  }
  return outputData;
};


module.exports = {getUserByEmail, urlsForUser};