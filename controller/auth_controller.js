let User = require("../database").Database;
const passport = require("../middleware/passport");

let authController = {
  loginPage: (req, res) => {
      res.render("login");
  },

  registerPage: (req, res) => {
      res.render("register");
  },

  loginSubmit: (req, res, next) => {
      passport.authenticate("local", {
          successRedirect: "/reminders",
          failureRedirect: "/auth/login",
          failureFlash: true
      })(req, res, next);
  },

  registerSubmit: (req, res) => {
      const { email, password } = req.body;

      // Check if user already exists
      User.findOne({ email: email }, (err, user) => {
          if (user) {
              res.render("register", {
                  error: "Email already registered."
              });
          } else {
              const newUser = new User({ email, password }); // Create a new user instance

              // Save the new user
              newUser.save(err => {
                  if (err) throw err;
                  res.redirect("/auth/login"); // Redirect to login after successful registration
              });
          }
      });
  },

  logout: (req, res) => {
      req.logout();
      res.redirect("/auth/login");
  }
};

module.exports = authController;