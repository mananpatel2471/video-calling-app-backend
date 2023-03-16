const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const mongoUrl =
 "mongodb+srv://MANAN:kQa4J1LslhIo4x42@cluster0.zjtsjgw.mongodb.net/?retryWrites=true&w=majority";

 mongoose.set("strictQuery", false);
 mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

  require("./userDetails");
    
const User = mongoose.model("UserInfo");  

app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });            
    if (oldUser) {
     return res.json({ error: "User Exists" });
    }
     await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ error: "User Not found" });
      }
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({}, JWT_SECRET);
  
        if (res.status(201)) {
          return res.json({ status: "ok", data: token });
        } else {
          return res.json({ error: "error" });
        }
      }
      res.json({ status: "error", error: "Invalid Password" });
    });




// var router = express.Router()

// app.use("/v1/",router);
// require("./routes/config")(router);


// var router2 = express.Router()

// app.use("/v2/",router2)
// require("./routes/config")(router2);




app.listen(5000, () => {
  console.log("Server Started");
});


