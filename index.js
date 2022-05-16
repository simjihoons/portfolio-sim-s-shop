const express = require("express");
const app = express();
const port = 5000;

const { User } = require("./models/User");

const bodyParser = require("body-parser");
const config = require("./config/key");

//application/x-www-form-urlencoded 파일을 분석
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 파일을 분석
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB 연결 성공"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello!!"));

app.post("/register", (req, res) => {
  const user = new User(req.body);

  //password 암호화
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}~!`);
});
