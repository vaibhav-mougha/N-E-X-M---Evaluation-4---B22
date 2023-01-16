const express = require("express");
require("dotenv").config();
const PORT = process.env.port;
const { connection } = require("./configs/db");

const { userRouter } = require("./Routes/User.route");
const { postRouter } = require("./Routes/Post.route");
const { authenticate } = require("./Middlewares/Authenticate.middleware");

const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Welcome Home Page");
});

app.use("/users", userRouter);
app.use(authenticate);
app.use("/posts", postRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
  } catch (error) {
    console.log(error);
  }
  console.log(`Server is running at PORT : ${PORT} `);
});
