const ld = require('lodash');
const Validator = require('ms-amqp-validation');
const { validateSync } = new Validator('./schemas');

module.exports = class MailerClient {

  /**
   * Default options
   * @type {Object}
   */
  static defaultOpts = {
    prefix: 'mailer',
    routes: {
      adhoc: 'adhoc',
      predefined: 'predefined'
    }
  };

  /**
   * Construct client
   * @param  {AMQPTransport} amqp
   * @param  {Object}        opts
   * @return {MailerClient}
   */
  constructor(amqp, opts = {}) {
    const config = this._config = ld.merge({}, MailerClient.defaultOpts, opts);

    // check configuration
    const isntValid = validateSync('config', config);
    if (isntValid) {
      throw isntValid;
    }

    if (!amqp) {
      throw new Error('amqp client must be passed as a second argument');
    }
    this._amqp = amqp;
  }

  /**
   * Sends an email
   *
   * @param  {String|Object} account
   * @param  {Object}        email
   * @return {Promise}
   */
  send(account, email) {
    const { routes, prefix } = this._config;

    let route;
    if (typeof account === 'string') {
      route = routes.predefined;
    } else {
      route = routes.adhoc;
    }

    return this._amqp.publishAndWait(`${prefix}.${route}`, { account, email }, { timeout: 35000 });
  }

}
