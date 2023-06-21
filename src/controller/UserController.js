const User = require("../models/user");
exports.signup = (req, res) => {
  // Check whether email already exists
  try {
    const { email } = req.body;

    User.findOne({ email }, (err, email) => {
      if (err || email) {
        // console.log(err);
        return res
          .status(400)
          .send({ status: "400", message: "Email already exists" });
      }
      req.body.role = "user";

      // If email don't exist, create user
      const user = new User(req.body);
      user.save((err, user) => {
        if (err) {
          return res.status(400).send({
            status: "500",
            message: "Unable to signup. Try again later",
            err,
          });
        }
        return res.status(201).send({
          status: "201",
          message: "Successfully added user",
          user: {
            id: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
          },
        });
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      status: "500",
      message: "Unable to signup. Try again later",
      err,
    });
  }
};

exports.signin = (req, res) => {
  try {
    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .send({ status: "400", message: "Email does not exists" });
      }

      /**
       * @DESC Check Role Middleware
       */
      if (user.status === "approved") {
        if (!user.authenticate(password)) {
          return res.status(400).send({
            status: "400",
            message: "Email and password does not match",
          });
        }

        // create a token
        const token = jwt.sign(
          { _id: user._id, role: user.role, email: user.email },
          process.env.SECRET,
          { expiresIn: "100m" }
        );

        // Put token in cookie
        res.cookie("token", token);
        // Send response to front end
        // const { _id, name, email, role } = user
        return res.status(200).send({
          status: "200",
          user: {
            _id: user._id,
            role: user.role,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: `Bearer ${token}`,
          },
        });
      } else if (user.status === "pending") {
        return res
          .status(401)
          .send({ status: "401", message: "Account is not active yet" });
      } else if (user.status === "rejected") {
        return res.status(401).send({
          status: "401",
          message: "Your account is rejected by the admin",
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      status: "500",
      message: "Unable to signup. Try again later",
      err,
    });
  }
};
