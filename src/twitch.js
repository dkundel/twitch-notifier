const request = require('request');
const path = require('path');
const EventEmitter = require('events');

const BASE_URL = 'https://api.twitch.tv/kraken/';
const CONTENT_TYPE = 'application/vnd.twitchtv.v3+json';

class Twitch extends EventEmitter {
  constructor() {
    this.currentlyOnline = new Map();
    this.subscribers = new Map();
  }

  makeRequest(endPoint, params, callback) {
    let options = {
      url: `${BASE_URL}${endPoint}`,
      headers: {
        'Accept': CONTENT_TYPE,
        'Client-ID': process.env.TWITCH_CLIENT_ID
      },
      qs: params
    };
    request(options, (err, resp, body) => {
      if (err) {
        console.error('ERROR');
        console.error(err);
        return;
      }
      body = JSON.parse(body);
      callback(err, resp, body);
    });
  }

  getStreams() {
    let channels = ['dkundel', 'marcos_placona'];

    this.makeRequest('streams', { channel: channels.join(',') }, (err, resp, body) => {
      let name = body.streams[0].channel.name;
      this.emit('went-online', { name });
    });
  }

  subscribe(name, phoneNumber) {
    if (this.subscribers.has(name)) {
      this.subscribers.get(name).push(phoneNumber);
    } else {
      this.subscribers.set(name, [ phoneNumber ]);
    }
  }
}

module.exports = {
  Twitch: new Twitch()
};