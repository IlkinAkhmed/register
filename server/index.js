const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());


app.use(session({
  secret: "sdogj@#!##__45",
  resave: false,
  saveUninitialized: true
}))



const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String , minLength:[3,'username must be minimum 3 character'],maxLength:[15,'username must be maximum 15 character'] ,required: true },
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

// user  register
app.post('/register', async (req, res) => {
  try {
    const findedUser = await Users.findOne({ username: req.body.username })
    if (findedUser) {
      res.send('Username already exist!! Try other Username')
      return
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = new Users({
        username: req.body.username,
        password: hashedPassword
      })
      await user.save()
      res.status(200).json({ message: "user created!" })

    }
  } catch (error) {
    res.status(500).json({ message: error });

  }
})

// user login
app.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({username:req.body.username})
    if(user && bcrypt.compare(req.body.password,user.password)){
      req.session.userId = user._id
      res.status(200).send('User Sign In')
    }

  } catch (error) {
    res.status(500).json({ message: error });

  }
})






mongoose
  .connect(
    "mongodb+srv://identification:ilkin123@cluster0.ghwwmer.mongodb.net/"
  )
  .catch((error) => console.log("db not connect" + error));

app.listen(5000, () => {
  console.log("server 5000 portunda isleyir");
});
