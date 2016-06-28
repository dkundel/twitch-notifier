const request = require('request');
const path = require('path');
const EventEmitter = require('events');

const BASE_URL = 'https://api.twitch.tv/kraken/';
const CONTENT_TYPE = 'application/vnd.twitchtv.v3+json';

class Twitch extends EventEmitter {

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

  init() {
    this.subscribers = this.subscribers || new Map();
    this.currentlyOnline = this.currentlyOnline || new Map();
  }

  setStreamOnline(name) {
    this.currentlyOnline.set(name, true);
    this.emit('went-online', { name });
  }

  setStreamOffline(name) {
    this.currentlyOnline.delete(name);
    this.emit('went-offline', { name });
  }

  iteratorToArray(iterator) {
    let array = [];
    for (let i of iterator) {
      array.push(i);
    }

    return array;
  }

  getStreams() {
    this.init();
    let channels = this.iteratorToArray(this.subscribers.keys());

    console.log(channels);

    let notOnline = new Map();
    for (let [channel, numbers] of this.subscribers) {
      notOnline.set(channel, true);
    }

    this.makeRequest('streams', { channel: channels.join(',') }, (err, resp, body) => {
      let name = body.streams[0].channel.name;

      body.streams.forEach((stream) => {
        let name = stream.channel.name;
        notOnline.delete(name);
        if (!this.currentlyOnline.has(name)) {
          this.setStreamOnline(name);
        }
      });

      for (let [name, isOffline] of notOnline) {
        this.setStreamOffline(name);
      }
    });
  }

  subscribe(name, phoneNumber) {
    this.init();
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