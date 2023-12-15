const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: "askle#@!!302_",
    resave: false,
    saveUninitialized: true,
  })
);

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Users = mongoose.model("registers", userSchema);

app.get("/register", async (req, res) => {
  try {
    const user = await Users.find({});
    res.send(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/register", async (req, res) => {
  try {
    const findeduser = await Users.findOne({ username: req.body.username });
    if (findeduser) {
      res.status(404).json({ message: "username already exist!! Try other username" });
      return;
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new Users({
        username: req.body.username,
        password: hashedPassword,
      });
      await user.save();
      res.status(200).json({ message: "user created" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

mongoose
  .connect(
    "mongodb+srv://identification:ilkin123@cluster0.ghwwmer.mongodb.net/"
  )
  .catch((error) => console.log("db not connect" + error));

app.listen(5000, () => {
  console.log("server 5000 portunda isleyir");
});
