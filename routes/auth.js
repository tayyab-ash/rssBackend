const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { query, body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "iamagoodboihehe";

//Creating a User

router.post(
  "/createuser",
  [
    body("fname", "Enter a valid name").isLength({ min: 3 }),
    body("lname", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be 5 characters long").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // console.log(req.body);

    // const user = User(req.body);
    // user.save();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with the same email already exists." });
      }

      const salt = await bcrypt.genSalt(10);
      const secretPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: secretPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      //   console.log(authToken)
      // .then(user => res.json(user))
      // .catch(err => {console.log(err)
      //     res.json({error: 'Email already exists'})
      // })
      // res.send({ errors: result.array() });

      // res.send(req.body);
      //   res.json(user);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//User Login

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = true
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false
        return res.status(400).json({ success,  error: "Wrong Credientials." });
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        success = false
        return res.status(400).json({ success, error: "Wrong Credientials." });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Getting user detail
router.post( "/fetchuser", fetchuser, async (req, res) => {
    try {
        userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
      }
  }
);

module.exports = router;
