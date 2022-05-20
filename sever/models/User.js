const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    trim: true,
    required: true,
  },
  role: {
    type: Number,
    default: 0, // 1 : admin
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  let user = this;
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    return callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function (callback) {
  let user = this;
  let token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function (err, user) {
    if (err) return callback(err);
    return callback(null, user);
  });
};

userSchema.statics.findByToken = function (token, callback) {
  let user = this;

  //token decode **decoded=> user._id
  jwt.verify(token, "secretToken", function (err, decoded) {
    //클라이언트에서 가져온  token 과 DB에 보관된 토큰 일치확인
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return callback(err);
      return callback(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
