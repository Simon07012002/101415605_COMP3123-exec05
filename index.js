const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();

// Middleware to parse JSON request bodies
app.use(express.json());

/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html')); // Serve home.html
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user file' });
    }
    res.json(JSON.parse(data)); // Send user details as JSON
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  password is valid then send response as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If password is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user file' });
    }

    const user = JSON.parse(data);

    if (user.username !== username) {
      return res.json({ status: false, message: 'User Name is invalid' });
    }

    if (user.password !== password) {
      return res.json({ status: false, message: 'Password is invalid' });
    }

    res.json({ status: true, message: 'User Is valid' });
  });
});

/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logged out.<b>
*/
router.get('/logout', (req, res) => {
  const { username } = req.query;

  if (username) {
    res.send(`<b>${username} successfully logged out.</b>`);
  } else {
    res.send('<b>Username is missing.</b>');
  }
});

/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/
app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.use('/', router);

const port = process.env.PORT || 3123;
app.listen(port, () => {
  console.log(`Web Server is listening at port ${port}`);
});
