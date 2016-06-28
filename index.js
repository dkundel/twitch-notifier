const bodyParser = require('body-parser');
const chalk = require('chalk');
const twilio = require('twilio');
const restify = require('restify');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const success = chalk.bold.green;
const error = chalk.bold.red;
const PORT = process.env.PORT || 3000;

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

// Twitch.subscribe('dkundel', process.env.MY_PHONE_NUMBER);
// Twitch.subscribe('marcos_placona', process.env.MY_PHONE_NUMBER);
// Twitch.startPoll(5);

const server = restify.createServer();

// parse application/x-www-form-urlencoded 
server.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
server.use(bodyParser.json())

server.post('/sms', (req, res, next) => {
  console.log(req.body.Body);
  res.header('Content-Type', 'text/plain');
  res.send('Thanks for subscribing!');
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});