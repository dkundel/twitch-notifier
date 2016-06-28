# twitch-notifier
An SMS notifier for Twitch streams

## Installation

1. Get a client ID and set it as an environment variable `TWITCH_CLIENT_ID`

2. Register with Twilio and store your credentials as `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`

3. Store your own phone number as `MY_PHONE_NUMBER`

4. Execute:

```bash
git clone https://github.com/dkundel/twitch-notifier.git
cd twitch-notifier
npm install
npm start
```