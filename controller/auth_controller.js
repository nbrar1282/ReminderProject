let User = require("../database").database;
const passport = require("../middleware/passport");

let authController = {
    loginPage: (req, res) => {
        res.render("auth/login");
    },

    registerPage: (req, res) => {
        res.render("auth/register");
    },

    loginSubmit: (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                // Handle login failure
                return res.redirect('/login');
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }

                // Redirect based on user role
                const redirectUrl = user.role === 'admin' ? '/admin' : '/reminders';
                return res.redirect(redirectUrl);
            });
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
    },

    isAdmin: (req, res, next) => {
        const userId = req.session.userId; // Get user ID from session
        const user = User.find(u => u.id === userId); // Find user in the database

        if (!user || user.role !== 'admin') {
            return res.status(403).send('Access denied');
        }

        next(); // User is an admin, proceed to the next middleware/route handler
    },
};

module.exports = authController;
