const {createClient} = require("redis");

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
// client.on('connect', () => console.log('Redis Connected on Port 6379'));

module.exports = client;

