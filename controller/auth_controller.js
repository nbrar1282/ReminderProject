let User = require("../database").database;
const passport = require("../middleware/passport");
const userModel = require("../database").userModel;
const sessions = require("../activesession")
let authController = {
    loginPage: (req, res) => {
        res.render("auth/login");
    },

    registerPage: (req, res) => {
        res.render("auth/register");
    },

  loginSubmit: (req, res, next) => {
      passport.authenticate("local", {
          successRedirect: "/reminders",
          failureRedirect: "/login",
          failureFlash: true
      })(req, res, next);
  },

    registerSubmit: (req, res) => {
        const { email, password } = req.body;

        // Check if user already exists
        User.findOne({ email: email }, (err, user) => {
            if (user) {
                res.render("auth/register", {
                    error: "Email already registered."
                });
            } else {
                const newUser = new User({ email, password }); // Create a new user instance

                // Save the new user
                newUser.save(err => {
                    if (err) throw err;
                    res.redirect("/login"); // Redirect to login after successful registration
                });
            }
        });
    },

  logout: (req, res) => {
      req.logout();
      res.redirect("/login");
  }
};

module.exports = authController;