const activeSessions = {};

activeSessions['session1'] = {
  id: 'session1',
  user: { name: 'Alice', role: 'user', id: 2 },
  lastAccess: new Date().toISOString()
};
activeSessions['session2'] = {
  id: 'session2',
  user: { name: 'Bob', role: 'user' },
  lastAccess: new Date().toISOString()
};
console.log(activeSessions.session1.id);
module.exports = activeSessions;