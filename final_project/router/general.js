const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");
const public_users = express.Router();

const app = express();
app.use(express.json());

// Register a new user
public_users.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required!" });
    }

    try {
        const userExists = users.some(user => user.username === username);
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "Registered successfully! You can now login!" });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://aomkhamphaun-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/');
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching book list:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  axios.get(`https://aomkhamphaun-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`)
      .then(response => {
          res.json(response.data);
      })
      .catch(error => {
          console.error("Error fetching book details:", error);
          res.status(404).json({ message: "Book not found!" });
      });
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`https://aomkhamphaun-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching books by author:", error);
        return res.status(404).json({ message: "Books not found!" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`https://aomkhamphaun-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching books by title:", error);
        return res.status(404).json({ message: "Books not found!" });
    }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`https://aomkhamphaun-5000.theiadockernext-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/review/${isbn}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching book reviews:", error);
        return res.status(404).json({ message: "Book not found!" });
    }
});

module.exports = public_users;
