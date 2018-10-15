/* eslint-disable global-require, prefer-arrow-callback */
const assert = require('assert');

describe('MailerClient', function testSuite() {
  const MailerClient = require('../src');

  const FakeAMQP = {};
  it('throws on invalid configuration', function test() {
    assert.throws(
      () => new MailerClient(FakeAMQP, { routes: 'no', prefix: 10 }),
      /HttpStatusError/
    );
  });

  it('throws on missing amqp client', function test() {
    assert.throws(() => new MailerClient(), /amqp client must be passed as a first argument/);
  });

  it('constructs amqp client when correct configuration is passed', function test() {
    assert.doesNotThrow(() => new MailerClient(FakeAMQP));
  });
});
