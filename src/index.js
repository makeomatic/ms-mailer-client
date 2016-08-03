const ld = require('lodash');
const Validator = require('ms-validation');

const { validateSync } = new Validator('../schemas');

module.exports = class MailerClient {

  /**
   * Default options
   * @type {Object}
   */
  static defaultOpts = {
    prefix: 'mailer',
    routes: {
      adhoc: 'adhoc',
      predefined: 'predefined',
    },
  };

  /**
   * Construct client
   * @param  {AMQPTransport} amqp
   * @param  {Object}        opts
   * @return {MailerClient}
   */
  constructor(amqp, opts = {}) {
    const config = this.config = ld.merge({}, MailerClient.defaultOpts, opts);

    // check configuration
    const isntValid = validateSync('config', config);
    if (isntValid.error) {
      throw isntValid.error;
    }

    if (!amqp) {
      throw new Error('amqp client must be passed as a first argument');
    }

    this.amqp = amqp;
  }

  /**
   * Sends an email
   *
   * @param  {String|Object} account
   * @param  {Object}        email
   * @return {Promise}
   */
  send(account, email, opts = {}) {
    const { routes, prefix } = this.config;

    let route;
    if (typeof account === 'string') {
      route = routes.predefined;
    } else {
      route = routes.adhoc;
    }

    const action = opts.wait ? 'publishAndWait' : 'publish';
    const timeout = opts.timeout || 180000;

    return this.amqp[action](`${prefix}.${route}`, { account, email }, { timeout });
  }

};
