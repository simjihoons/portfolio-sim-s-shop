const { User } = require("../models/User");

let auth = (req, res, next) => {
  //인증 처리
  let token = req.cookie.x_auth; // 토큰을 쿠기에서 가져옴

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
