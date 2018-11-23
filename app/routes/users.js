const express = require("express"),
  router = express.Router();
const fs = require("fs");
const jwtValidate = require("../middleware/jwt");

router.get("/", jwtValidate.checkToken, (req, res) => {
  const userDb = require("../data/users.json");

  res.json(userDb);
});

router.get("/:userId", jwtValidate.checkToken, (req, res) => {
  const userDb = require("../data/users.json");
  const userName = req.params.userId;

  if (!userName) {
    res.status(500).send("User name not specified");
  }

  const user = userDb.users.find(u => u.userName == userName);

  if (!user) {
    res.status(500).send("User not found");
  } else {
    res.json(user);
  }
});

router.delete("/:userId", jwtValidate.checkToken, (req, res) => {
  const userDb = require("../data/users.json");
  const userName = req.params.userId;

  if (!userName) {
    res.status(500).send("User name not specified");
    return;
  }

  const user = userDb.users.find(u => u.userName == userName);

  if (!user) {
    res.status(500).send("User not found");
  } else {
    userDb.users.splice(userDb.users.indexOf(user), 1);

    fs.writeFile("./app/data/users.json", JSON.stringify(userDb), function(
      err
    ) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.status(200).send(`User ${userName} deleted`);
    });
  }
});

router.put("/:userId", jwtValidate.checkToken, (req, res) => {
  const userDb = require("../data/users.json");
  const userName = req.params.userId;
  const password = req.body.password;

  if (!userName) {
    res.status(500).send("User name not specified");
    return;
  }

  if (!password) {
    res.send("Nothing to update");
    return;
  }

  const user = userDb.users.find(u => u.userName == userName);

  if (!user) {
    res.status(500).send("User not found");
  } else {
    user.password = password;

    fs.writeFile("./app/data/users.json", JSON.stringify(userDb), function(
      err
    ) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.status(200).send(`User ${userName} updated`);
    });
  }
});

module.exports = router;
