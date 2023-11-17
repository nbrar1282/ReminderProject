let database = require("../database");

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: database.cindy.reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database.cindy.reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: database.cindy.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    database.cindy.reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    // implementation here 👈

      let reminderToUpdate = req.params.id;
      let updatedReminder = database.cindy.reminders.find(function (reminder) {
        return reminder.id == reminderToUpdate;
      });
    
      if (updatedReminder) {
        updatedReminder.title = req.body.title;
        updatedReminder.description = req.body.description;
        if (req.body.completed.toLowerCase() === 'false') {
          updatedReminder.completed = false;
        } else {
          updatedReminder.completed = true;
        } // Assuming this is a boolean
        console.log(updatedReminder.completed)
        res.redirect("/reminders");
      } else {
        res.status(404).send('Reminder not found');
      }

    
  },

  delete: (req, res) => {
    // implementation here 👈
    let reminderToDelete = req.params.id;
    let reminders = database.cindy.reminders;
    let initialLength = reminders.length;
    database.cindy.reminders = reminders.filter(function (reminder) {
      return reminder.id != reminderToDelete;
    });
  
    if (initialLength !== database.cindy.reminders.length) {
      res.redirect("/reminders");
    } else {
      res.status(404).send('Reminder not found');
    }
  }
};
  



module.exports = remindersController;
