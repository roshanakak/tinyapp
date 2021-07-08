const { assert } = require('chai');
const {getUserByEmail, urlsForUser} = require("../helpers/users");

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

// const user = getUserByEmail(testUsers, "user@example.com")
// console.log(user)
    
describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com")
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput);
  });
  
  it('should return undefined for an invalid email', function() {
    const user = getUserByEmail(testUsers, "user3@example.com")
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});