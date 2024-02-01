const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if(!username || !password) {
    res.status(400).json({message: "Username and password required!"});
  }

  const user = users.find(user => user.username === username);
  if(!user) {
    res.status(404).json({message: "User not found!"});
  }

  if(user.password !== password) {
    res.status(400).json({message: "Invalid credentials!"});
  }

  const token = jwt.sign({username}, 'secret');
  res.json({token});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req.user; 

  const bookIndex = books.findIndex(book => book.isbn === isbn);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found!" });
  }

  const existingReviewIndex = books[bookIndex].reviews.findIndex(r => r.username === username);

  if (existingReviewIndex !== -1) {
    books[bookIndex].reviews[existingReviewIndex].review = review;
    return res.status(200).json({ message: "Review updated successfully!" });
  } else {
    books[bookIndex].reviews.push({ username, review });
    return res.status(200).json({ message: "Review added successfully!" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
