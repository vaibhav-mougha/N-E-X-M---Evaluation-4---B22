const express = require("express");
const { PostModel } = require("../Models/Post.model");

const postRouter = express.Router();
postRouter.use(express.json());

postRouter.get("/", async (req, res) => {
  const {device,device1,device2} = req.query;

  let posts;

  try {
    posts = await PostModel.find();

    if(device){
        posts = await PostModel.find({device:device})
    };
    
    if (device1 && device2) {
        posts = await PostModel.find({device1:device,device2:device})
    } 

    res.status(201).send(posts)
  } catch (error) {
    res.status(401).send({
      error,
      message: "Something went wrong in getting all the Posts present",
    });
  }

});

postRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const new_post = new PostModel(payload);
    await new_post.save();
    res.send("Created The Post");
  } catch (error) {
    console.log(error);
    res.send({"msg":"Something went wrong"})
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const payload = req.body;
  const id = req.params.id;
  const post = await PostModel.find({ _id: id });
  const userID_in_post = post.userID;
  const userID_making_req = req.body.userID;

  try {
    if (userID_making_req !== userID_in_post) {
      res.send({ msg: "You Are Not Authorized" });
    } else {
      await PostModel.findByIdAndUpdate({ _id: id }, payload);
      res.send("Updated The Post");
    }
  } catch (error) {
    console.log(error);
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const post = await PostModel.find({ _id: id });
  const userID_in_post = post.userID;
  const userID_making_req = req.body.userID;

  try {
    if (userID_making_req !== userID_in_post) {
      res.send({ msg: "You Are Not Authorized" });
    } else {
      await PostModel.findByIdAndDelete({ _id: id });
      res.send("Deleted The Post");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
    postRouter,
};
