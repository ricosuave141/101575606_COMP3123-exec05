const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const USER_FILE = path.join(__dirname, '..', 'user.json');

// read and parse user.json pass any error to the callback
function readUser(callback) {
  fs.readFile(USER_FILE, 'utf8', (err, data) => {
    if (err) return callback(err);
    try {
      callback(null, JSON.parse(data));
    } catch (parseErr) {
      callback(parseErr);
    }
  });
}
/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res, next) => {
  readUser((err, user) => {
    if (err) return next(err);
    res.json(user);
  });
});

/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below
    {
        status: false,
        message: "Password is invalid"
    }
*/
router.post('/login', (req, res, next) => {
  const { username, password } = req.body || {};

  readUser((err, user) => {
    if (err) return next(err);

    if (username !== user.username) {
      return res.json({ status: false, message: 'User Name is invalid' });
    }
    if (password !== user.password) {
      return res.json({ status: false, message: 'Password is invalid' });
    }
    res.json({ status: true, message: 'User Is valid' });
  });
});
/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
router.get('/logout/:username', (req, res) => {
  const { username } = req.params;
  res.send(`<b>${username} successfully logged out.</b>`);
});

module.exports = router;