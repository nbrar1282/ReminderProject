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
    const { email, password } = req.body;
    const user = userModel.findOne(email);
    if (user.role === 'admin') {
        passport.authenticate("local", {
            successRedirect: "/admin",
            failureRedirect: "/login",
            // failureFlash: true
        })(req, res, next);
        }else{

            passport.authenticate("local", {
                successRedirect: "/reminders",
                failureRedirect: "/login",
                // failureFlash: true
            })(req, res, next);}
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
    const sessionId = req.sessionID;
    if (sessions[sessionId]) {
        delete sessions[sessionId]; // Delete the session from activeSessions
    }
      req.logout((err) => {
          res.redirect("/login");
      });

    
  },

  adminPage: (reqs, res) => {
    // Check if the user is logged in and has the admin role
    if (reqs.isAuthenticated() && reqs.user.role === 'admin') {
        console.log('Active sessions: ', reqs.user.id);
        // Use the activeSessions object directly
        res.render("admin/admin", { 
            adminName: reqs.user.name,
            sessions: Object.values(sessions), // Convert the activeSessions object to an array
            currentSessionId: reqs.sessionID // Pass the current session ID


        });
    } else {
        // Redirect or show an error if the user is not an admin or not logged in
        res.redirect("/login");
    }
          },
    adminSubmit: (req, res) => {
        const { sessionId } = req.body;
        if (req.isAuthenticated() && req.user.role === 'admin') {
            // Implement logic to delete the session
            // This could be different based on how you're storing sessions
            delete activeSessions[sessionId]; // If sessions are stored in an object

            res.json({ success: true });
            
        } else {
            // If the user is not authenticated or not an admin, do not allow session revocation
            res.status(403).json({ success: false, message: 'Not authorized' });
        }}
  
};


module.exports = authController;

