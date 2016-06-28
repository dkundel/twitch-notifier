const { Twitch } = require('./src/twitch');

console.log('Ahoy!!');

Twitch.on('went-online', ({ name }) => {
  console.log(`${name} went online!`);
})

Twitch.getStreams();