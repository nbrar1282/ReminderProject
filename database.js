let Database = {
  users: {
    cindy: {
      email: "cindy@example.com",
      password: "password", // You should hash passwords in a real application
      reminders: [
        {
          id: 1,
          title: "Grocery shopping",
          description: "Buy milk and bread from safeway",
          completed: false,
        },
      ],
    },
    // Add more users as needed
  },
};





const userModel = {
  findOne: (email) => {
    const user = Database.users[email];
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id) => {
    const user = Database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  
};

module.exports = { Database, userModel };