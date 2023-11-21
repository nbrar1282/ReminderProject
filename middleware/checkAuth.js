module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      // User is authenticated, continue to the next middleware
      return next();
    }
    // User is not authenticated, redirect them to the login page
    res.redirect("/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    // User is already authenticated, redirect them to their own reminders page
    res.redirect(`/reminders`);
  },
};
