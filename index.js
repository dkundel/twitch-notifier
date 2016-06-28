const chalk = require('chalk');

const success = chalk.bold.green;
const error = chalk.bold.red;

const { Twitch } = require('./src/twitch');

console.log('Ahoy!!');

Twitch.on('went-online', ({ name }) => {
  console.log(`${name} went ${success('online')}!`);
});

Twitch.on('went-offline', ({ name }) => {
  console.log(`${name} went ${error('offline')}!`);
});

Twitch.subscribe('dkundel', '+11111111111');
Twitch.subscribe('marcos_placona', '+1111111111');
Twitch.startPoll(5);