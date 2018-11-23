const express = require("express"),
  router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  // check username length
  if (!userName || userName.length < 4) {
    res.status(500).send("Username length must be at least 4 characters.");
    return;
  }

  // check password length
  if (!password || password.length < 4) {
    res.status(500).send("Password length must be at least 4 characters.");
    return;
  }

  const userDb = require("../data/users.json");
  userDb.users.push({ userName, password });

  fs.writeFile("./app/data/users.json", JSON.stringify(userDb), function(err) {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.status(200).send(`User ${userName} successfully created`);
  });
});

router.post("/login", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    res.status(500).send("Username or password not specified");
  }

  const userDb = require("../data/users.json");
  const user = userDb.users.find(u => u.userName == userName);

  if (!user || user.password !== password) {
    res.status(403).send("Invalid username or password");
  }

  const token = jwt.sign({ username: userName }, "asd123asd15wqasd123asd1", {
    expiresIn: "2h"
  });

  res.json({
    success: true,
    token: token
  });
});

module.exports = router;
