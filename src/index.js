const assert = require('assert');
const merge = require('lodash.merge');
const Validator = require('@microfleet/validation').default;

const validator = new Validator('../schemas');

/**
 * @typedef  {Object} NodeMailerMessage
 * @property {String} from
 * @property {String} to
 * @property {String} subject
 * @property {String} [text]
 * @property {String} [html]
 */

/**
 * @typedef  {Object}  SendOptions
 * @property {Boolean} wait
 * @property {Number}  timeout
 */

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
    const config = merge({}, MailerClient.defaultOpts, opts);

    const { error, doc } = validator.validateSync('config', config);
    assert(!error, error);

    this.config = doc;

    if (!amqp) {
      throw new Error('amqp client must be passed as a first argument');
    }

    this.amqp = amqp;
  }

  /**
   * Internal method to perform actual action request
   *
   * @param  {Object}        message
   * @param  {String|Object} message.account
   * @param  {String|Object} message.email
   * @param  {Object}        [message.ctx]
   * @param  {SendOptions}   [opts]
   * @return {Promise}
   * @private
   */
  _send(message, opts) {
    const { routes, prefix } = this.config;

    let route;
    if (typeof message.account === 'string') {
      route = routes.predefined;
    } else {
      route = routes.adhoc;
    }

    const action = opts.wait ? 'publishAndWait' : 'publish';
    const timeout = opts.timeout || 180000;

    return this.amqp[action](`${prefix}.${route}`, message, { timeout });
  }

  /**
   * Sends an email
   *
   * @param  {String|Object}     account
   * @param  {NodeMailerMessage} email
   * @param  {SendOptions}       [opts]
   * @return {Promise}
   */
  send(account, email, opts = {}) {
    return this._send({ account, email }, opts);
  }

  /**
   * Sends email with context
   *
   * @param  {String|Object}     account
   * @param  {String}            template -- template name
   * @param  {Object}            ctx
   * @param  {NodeMailerMessage} ctx.nodemailer
   * @param  {Object}            [ctx.template]
   * @param  {SendOptions}       [opts]
   * @return {Promise}
   */
  sendTemplate(account, template, ctx, opts = {}) {
    return this._send({ account, email: template, ctx }, opts);
  }
};
