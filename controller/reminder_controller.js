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


  create: async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const user = database.find(u => u.id === req.user.id);
    if (user) {
      let coverImage;
      if (req.body.randomImage === 'true') {
        try {
          const unsplashResponse = await fetch('https://api.unsplash.com/photos/random?client_id=M-Y73DdK1ad11Az7RNSirBm23f7asVQm8nOXUy7OhFw');
          if (!unsplashResponse.ok) {
            throw new Error(`HTTP error! Status: ${unsplashResponse.status}`);
          }
          const imageData = await unsplashResponse.json();
          coverImage = imageData.urls.regular; // Using the regular size image
        } catch (error) {
          console.error('Error fetching random image:', error);
          return res.status(500).send("Error fetching random image.");
        }
      } else {
        // Logic to handle uploaded image path
        coverImage = 'path/to/uploaded/image'; // Replace with actual path
      }

      const newReminder = {
        id: user.reminders.length + 1,
        title: req.body.title,
        description: req.body.description,
        cover: coverImage,
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
