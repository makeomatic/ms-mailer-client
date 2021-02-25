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

### `send` method

```js
const Mailer = require('ms-mailer-client');
const mailer = new Mailer(transport, { /* config */ });

const promise = mailer.send('support@makeomatic.ru', {
  // nodemailer email body
  from: 'support@makeomatic.ru',
  to: 'test@example.com',
  subject: 'subj',
  text: 'some text',
  html: '<p>html version of some text</p>',
});

```

### `sendTemplate` method

```js
const Mailer = require('ms-mailer-client');
const mailer = new Mailer(transport, { /* config */ });

// can be used with adhoc account setup aswell
const promise = mailer.sendTemplate(
  'support@makeomatic.ru', 
  'reset', // template name
  {
    nodemailer: {
      from: 'support@makeomatic.ru',
      to: 'test@example.com',
      subject: 'subj',
    },
    ctx: {
      // template rendering context
      link: 'activation_link',
      name: 'John Doe',
    },
  }
);
```

Resulted promise can be fulfilled with rejection when
the requested template name does not exist. 
