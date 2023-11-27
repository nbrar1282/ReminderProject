const express = require("express");
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const { forwardAuthenticated } = require("./middleware/checkAuth");
const session = require("express-session");
const passport = require('./middleware/passport');
const flash = require('connect-flash');
const activeSessions = require('./activesession')
const sessionStore = new session.MemoryStore();

const app = express();




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

app.use(session({
  store: sessionStore,
  secret: 'your_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true if using HTTPS, ensures cookie is only sent over secure protocols
    httpOnly: true, // Mitigates XSS attacks by not allowing client-side script access to the cookie
    maxAge: 1000 * 60 * 60 * 24 // Cookie expiration duration in milliseconds (e.g., 24 hours here)
  
  },
  
}));




// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



app.use(flash()); 

app.use((req, res, next) => {
  if (req.isAuthenticated()) { // Check if the user is authenticated
      activeSessions[req.sessionID] = req.session;
      req.session.lastAccess = new Date();
      console.log('Active sessions: ', req.user.id);
      console.log(req)
      
  }
  next();
});

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

app.get("/admin", authController.adminPage);
app.post('/revoke-session', (req, res) => {
  const { sessionId } = req.body;
  if (req.isAuthenticated() && req.user.role === 'admin') {
    sessionStore.destroy(sessionId, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error revoking session' });
      }

      delete activeSessions[sessionId]; // Also remove from your activeSessions tracking
      res.redirect('/admin'); // Redirect back to the admin page
    });
  } else {
    res.status(403).json({ success: false, message: 'Not authorized' });
  }});
  
   
app.listen(3001, function () {
  console.log(
    "Server running. Visit: http://localhost:3001/reminders in your browser 🚀"
  );
});

