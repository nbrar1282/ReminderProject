let { database } = require("../database");

let remindersController = {
  list: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const user = database.find(u => u.id === req.user.id);
    if (user && user.reminders) {
      res.render("reminder/index", { reminders: user.reminders });
    } else {
      res.status(404).send("User not found or no reminders available.");
    }
  },

  new: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const user = database.find(u => u.id === req.user.id);
    const reminderId = parseInt(req.params.id);
    const reminder = user?.reminders.find(r => r.id === reminderId);

    if (reminder) {
      res.render("reminder/single-reminder", { reminderItem: reminder });
    } else {
      res.status(404).send("Reminder not found.");
    }
  },

  create: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const user = database.find(u => u.id === req.user.id);
    if (user) {
      const newReminder = {
        id: user.reminders.length + 1, // Generate a unique ID for the reminder
        title: req.body.title,
        description: req.body.description,
        completed: false,
      };

      user.reminders.push(newReminder);
      res.redirect("/reminders");
    } else {
      res.status(404).send("User not found.");
    }
  },

  edit: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const user = database.find(u => u.id === req.user.id);
    const reminderId = parseInt(req.params.id);
    const reminder = user?.reminders.find(r => r.id === reminderId);

    if (reminder) {
      res.render("reminder/edit", { reminderItem: reminder });
    } else {
      res.status(404).send("Reminder not found.");
    }
  },

  update: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const user = database.find(u => u.id === req.user.id);
    const reminderId = parseInt(req.params.id);
    const reminder = user?.reminders.find(r => r.id === reminderId);

    if (reminder) {
      reminder.title = req.body.title;
      reminder.description = req.body.description;
      reminder.completed = req.body.completed === 'true';

      res.redirect("/reminders");
    } else {
      res.status(404).send("Reminder not found.");
    }
  },

  delete: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const user = database.find(u => u.id === req.user.id);
    const reminderId = parseInt(req.params.id);

    const reminderIndex = user?.reminders.findIndex(r => r.id === reminderId);
    if (reminderIndex !== -1) {
      user.reminders.splice(reminderIndex, 1);
      res.redirect("/reminders");
    } else {
      res.status(404).send("Reminder not found.");
    }
  }
};

module.exports = remindersController;
