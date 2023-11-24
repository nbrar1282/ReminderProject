// sessionManager.js
const redisClient = require('redis').createClient();

const getActiveSessions = () => {
    return new Promise((resolve, reject) => {
        redisClient.keys('sess:*', (err, keys) => {
            if (err) {
                reject(err);
            } else {
                const sessions = keys.map(key => {
                    // Extract additional session info if needed
                    return { id: key };
                });
                resolve(sessions);
            }
        });
    });
};

module.exports = {
    getActiveSessions
};
