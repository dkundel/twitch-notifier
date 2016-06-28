const bodyParser = require('body-parser');
const chalk = require('chalk');
const twilio = require('twilio');
const restify = require('restify');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const success = chalk.bold.green;
const error = chalk.bold.red;
const PORT = process.env.PORT || 3000;
const PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const { Twitch } = require('./src/twitch');

console.log('Ahoy!!');

function notifyUsers(name, message) {
  if (Twitch.subscribers.has(name)) {
    Twitch.subscribers.get(name).forEach((number) => {
      client.sendMessage({
        from: PHONE_NUMBER,
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

const server = restify.createServer();

// parse application/x-www-form-urlencoded 
server.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
server.use(bodyParser.json())

server.post('/sms', (req, res, next) => {
  res.header('Content-Type', 'text/plain');
  // to subscribe text:
  // SUBSCRIBE: channel_name
  // to unsubscribe text:
  // UNSUBSCRIBE: channel_name
  const SUBSCRIBE = 'subscribe';
  const UNSUBSCRIBE = 'unsubscribe';
  let text = req.body.Body;
  
  if (text.toLowerCase().indexOf(SUBSCRIBE) === 0) {
    text = text.substr(SUBSCRIBE.length + 1).trim();
    console.log(`subscribed for ${text}`);
    Twitch.subscribe(text, req.body.From);
    res.send('Thanks for subscribing!');
  } else if (text.toLowerCase().indexOf(UNSUBSCRIBE) === 0) {
    text = text.substr(UNSUBSCRIBE.length + 1).trim();
    console.log(`unsubscribed for ${text}`);
    Twitch.unsubscribe(text, req.body.From);
    res.send('Thanks for unsubscribing!');
  } else {
    res.send(`Wrong format! Use: 
SUBSCRIBE: channel_name
or
UNSUBSCRIBE: channel_name
    `)
  }
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log('Start polling Twitch');
  Twitch.startPoll(60);
});