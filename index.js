const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const { forwardAuthenticated } = require("./middleware/checkAuth");
const session = require("express-session");
const passport = require('./middleware/passport');
const flash = require('connect-flash');
const { isAdmin } = require('./controller/auth_controller'); // Import the isAdmin middleware



app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(ejsLayouts);

app.set("view engine", "ejs");

// app.use((req, res, next) => {
//   console.log(`User details are: `);
//   console.log(req.user);

//   console.log("Entire session object:");
//   console.log(req.session);

//   console.log(`Session details are: `);
//   // console.log(req.session.passport);
//   next();
// });

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); 

// Routes start here
app.get("/reminders", reminderController.list);
app.get("/reminder/new", reminderController.new);
app.get("/reminder/:id", reminderController.listOne);
app.get("/reminder/:id/edit", reminderController.edit);
app.post("/reminder/", reminderController.create);
// ⭐ Implement these two routes below!
app.post("/reminder/update/:id", reminderController.update);
app.post("/reminder/delete/:id", reminderController.delete);

// 👌 Ignore for now
app.get("/login", forwardAuthenticated, authController.loginPage);
app.get("/register", forwardAuthenticated, authController.registerPage);
app.post("/login", authController.loginSubmit);
app.post("/register", authController.registerSubmit);
app.get("/logout", authController.logout);

// Route to render the admin dashboard
app.get('/admin', authController.isAdmin, (req, res) => {
  res.render('/admin');
});


app.post('/admin/destroy-session', isAdmin, (req, res) => {
  const sessionId = req.body.sessionId; // The ID of the session to destroy from POST data

  req.sessionStore.destroy(sessionId, (err) => {
    if (err) {
      console.error('Session destruction error:', err);
      res.status(500).json({ message: 'Failed to destroy the session.' });
    } else {
      res.json({ message: 'Session destroyed successfully.' });
    }
  });
});

app.listen(3001, function () {
  console.log(
    "Server running. Visit: http://localhost:3001/reminders in your browser 🚀"
  );
});
