let { Database } = require("../database");

let remindersController = {
  list: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const userEmail = req.user.email;
    const userReminders = Database.users[userEmail]?.reminders;
    if (userReminders) {
      res.render("reminder/index", { reminders: userReminders });
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
    const userEmail = req.user.email;
    let reminderToFind = req.params.id;
    let searchResult = Database.users[userEmail]?.reminders.find(reminder => reminder.id == reminderToFind);

    if (searchResult) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.status(404).send("Reminder not found.");
    }
  },

  create: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const userEmail = req.user.email;
    let reminder = {
      id: Database.users[userEmail].reminders.length + 1, // Unique ID generation needed
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    Database.users[userEmail].reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const userEmail = req.user.email;
    let reminderToFind = req.params.id;
    let searchResult = Database.users[userEmail]?.reminders.find(reminder => reminder.id == reminderToFind);

    if (searchResult) {
      res.render("reminder/edit", { reminderItem: searchResult });
    } else {
      res.status(404).send("Reminder not found.");
    }
  },

  update: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const userEmail = req.user.email;
    let reminderToUpdate = req.params.id;
    let updatedReminder = Database.users[userEmail]?.reminders.find(reminder => reminder.id == reminderToUpdate);

    if (updatedReminder) {
      updatedReminder.title = req.body.title;
      updatedReminder.description = req.body.description;
      updatedReminder.completed = req.body.completed.toLowerCase() === 'true';
      res.redirect("/reminders");
    } else {
      res.status(404).send('Reminder not found');
    }
  },

  delete: (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const userEmail = req.user.email;
    let reminderToDelete = req.params.id;
    let initialLength = Database.users[userEmail].reminders.length;
    Database.users[userEmail].reminders = Database.users[userEmail].reminders.filter(reminder => reminder.id != reminderToDelete);

    if (initialLength !== Database.users[userEmail].reminders.length) {
      res.redirect("/reminders");
    } else {
      res.status(404).send('Reminder not found');
    }
  }
};

module.exports = remindersController;
