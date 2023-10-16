const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if (isValid(username)) { 
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});    
      }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return new Promise ((resolve, reject) => {
      setTimeout(() => {
          resolve(res.send(JSON.stringify(books, null, 4)));
      }, 2000);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve(res.send(books[isbn]));
      }, 3000);
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  return new Promise((resolve, reject) => {
    const author = req.params.author;
    let filtered_author = [];
    const berks = Object.entries(books);
    for(const [key, value] of berks) {
        if (value.author === author) {
            filtered_author.push(value);
        }
    }
      setTimeout(() => {
          resolve(res.send(filtered_author));
      }, 3000);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return new Promise((resolve, reject) => {
    const title = req.params.title;
    let filtered_title = [];
    const berks = Object.entries(books);
    for(const [key, value] of berks) {
        if(value.title === title) {
            filtered_title.push(value);
        }
    }

    setTimeout(() => {
        resolve(res.send(filtered_title));
    }, 5000);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviewed_books = books[isbn];

  res.send(reviewed_books.reviews);
});

module.exports.general = public_users;
