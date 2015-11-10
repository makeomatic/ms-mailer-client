# Mailer microservice client

Encapsulates raw AMQP methods into a convenience wrapper.

## Installation

`npm i ms-mailer-client -S`

## Usage

```js
const Mailer = require('ms-mailer-client');

const mailer = new Mailer(amqpTransport, {
  prefix: 'mailer',
  routes: {
    adhoc: 'adhoc',
    predefined: 'predefined'
  }
});

// use predefined email
const promisePredefined = mailer.send('support@makeomatic.ru', {
  // email body with nodemailer
});

// use adhoc account
const promiseAdhoc = mailer.send({
  // nodemailer smtp data
  service: 'gmail',
  auth: {

  }
}, {
  // nodemailer email body
});
```
