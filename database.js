const database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    reminders: [],
    role: "admin",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",   
    password: "johnny123!",
    reminders: [{id:1, title: "Buy groceries", description: "Buy milk, eggs, and bread", completed: false}],
    role:"user"
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    reminders: [{id:1, title: "Play football", description: "Play 30 mins a day ", completed: false}],
    role:"user"
  },
];

const userModel = {
  findOne: (email) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
};

module.exports = { database, userModel };
