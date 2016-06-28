const chalk = require('chalk');
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const success = chalk.bold.green;
const error = chalk.bold.red;

const { Twitch } = require('./src/twitch');

console.log('Ahoy!!');

function notifyUsers(name, message) {
  if (Twitch.subscribers.has(name)) {
    Twitch.subscribers.get(name).forEach((number) => {
      client.sendMessage({
        from: '+4915735982633',
        to: number,
        body: message
      }).then(() => {
        console.log(success('MESSAGE SENT!'));
      })
    });
  }
}

Twitch.on('went-online', ({ name }) => {
  console.log(`${name} went ${success('online')}!`);
  notifyUsers(name, `Hi! ${name} just went online on Twitch!`);
});

Twitch.on('went-offline', ({ name }) => {
  console.log(`${name} went ${error('offline')}!`);
  notifyUsers(name, `Hi! ${name} just went offline :(!`);
});

Twitch.subscribe('dkundel', process.env.MY_PHONE_NUMBER);
Twitch.subscribe('marcos_placona', process.env.MY_PHONE_NUMBER);
Twitch.startPoll(5);