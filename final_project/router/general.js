const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to fetch data from the external server
const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data from ${url}: ${error.message}`);
  }
};

// Endpoint to get book details by author using async-await
public_users.get('/author/async/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const data = await fetchData('http://localhost:5001/');
    const booksByAuthor = Object.values(data).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ message: 'No books found by this author' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Endpoint to get book details by ISBN using Promises
public_users.get('/isbn/promises/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5001/`)
    .then(response => {
      res.setHeader('Content-Type', 'application/json');
      res.send(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error fetching book details', error: error.message });
    });
});

// Endpoint to get book details by ISBN using async-await
public_users.get('/isbn/async/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5001/`);
    res.setHeader('Content-Type', 'application/json');
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book details', error: error.message });
  }
});

// Fallback route to get book details by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Endpoint to get the list of books using Promises
public_users.get('/promises', function (req, res) {
  axios.get('http://localhost:5001/')
    .then(response => {
      res.setHeader('Content-Type', 'application/json');
      res.send(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error fetching books', error: error.message });
    });
});

// Endpoint to get the list of books using async-await
public_users.get('/async', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5001/');
    res.setHeader('Content-Type', 'application/json');
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// Fallback route to get the list of books
public_users.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(books);
});

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if the username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    // Add the new user to the users list
    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully' });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(books, null, 2));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.isbn === isbn);

  if (book) {
      res.json(book);
  } else {
      res.status(404).json({ message: 'Book not found' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(b => b.author === author);

    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: 'Books by this author not found' });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
    const booksByTitle = Object.values(books).filter(b => b.title === title);

    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    } else {
        res.status(404).json({ message: 'Books with this title not found' });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
    const book = Object.values(books).find(b => b.isbn === isbn);

    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
