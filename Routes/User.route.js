require("dotenv").config();
const SecretKey = process.env.SecretKey;

const express = require("express");
const { UserModel } = require("../Models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get("/", async (req, res) => { 
 
        const user = await UserModel.find();

        res.status(200).send(user)
     
});

userRouter.post("/register", async (req, res) => { 
  const { email, pass, name, gender } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash_password) => {
      if (err) {
        console.log(err);
      } else {
        const user = new UserModel({
          email,
          pass: hash_password,
          name,
          gender,
        });
        await user.save();
        res.send("Registered");
      }
    });
  } catch (error) {
    res.send("Error in Registering the user")
    console.log(error);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass} = req.body;
  try {
    const user = await UserModel.find({ email });
    // console.log(user)
    if (user.length > 0) {
      bcrypt.compare(pass, user[0].pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, SecretKey); // payload = userID , secretkey = masai
          res.send({ msg: "Login Successfull", token: token });
        } else {
          res.send("Wrong Credntials");
        }
      });
    } else {
      res.send("Wrong Credntials");
    }
  } catch (error) {
    res.send("Something went wrong")
    console.log(error);
  }
});


module.exports = {
  userRouter,
};
