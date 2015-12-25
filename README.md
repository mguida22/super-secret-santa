# Secret Santa

Organize secret santa and text your friends the plans from the command line. :santa:

![screenshot](https://cloud.githubusercontent.com/assets/9451227/11999504/a5e50280-aa8d-11e5-8a22-ebdc7fc64af3.png)

## Setup

Install from npm.
```
$ npm install -g super-secret-santa
```

Get an `ACCOUNT_SID`, `AUTH_TOKEN` and `PHONE_NUMBER` from Twilio and add them to a file named `.env` in the same directory as the script. A sample file should look like this.

```
ACCOUNT_SID=<account_sid>
AUTH_TOKEN=<auth_token>
PHONE_NUMBER=<phone_number>
NODE_ENV=<environment>
```

Set the `NODE_ENV` to `production` to tweet out the results. If this is set to anything else, the program will display the results to the console instead.

## License

MIT
