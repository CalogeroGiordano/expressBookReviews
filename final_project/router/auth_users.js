const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {accessToken,username}
  return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const curr = req.session.authorization.username;
  const userReview = req.params.review;
  const isbn = req.params.isbn;
  let bookReviews = books[isbn].reviews;
  let reviewExists = false;
  for (const username in bookReviews) {
      if (username === curr) {
          bookReviews[curr] = userReview;
          reviewExists = true;
          break;
      }
  }
  if (!reviewExists) {
      bookReviews[curr] = userReview;
  }
  res.send("The customer's review has been added/updated successfully.");
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const curr = req.session.authorization.username;
    const isbn = req.params.isbn;
    const bookReviews = books[isbn].reviews;
    let reviewExists = false;
    for (const username in bookReviews) {
        if (username === curr) {
            delete bookReviews[curr];
            reviewExists = true;
            break;
        }
    }
    if (!reviewExists) {
        res.send("The Customer was unable to delete the review.");
    }
    res.send("The Customer deleted the review successfully.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
