/* eslint-disable global-require, prefer-arrow-callback */
const assert = require('assert');

describe('MailerClient', function testSuite() {
  const MailerClient = require('../src');

  const FakeAMQP = {};
  it('throws on invalid configuration', async function test() {
    const client = new MailerClient(FakeAMQP, { routes: 'no', prefix: 10 });
    await assert.rejects(client.ready(), /HttpStatusError/);
  });

  it('throws on missing amqp client', function test() {
    assert.throws(() => new MailerClient(), /amqp client must be passed as a first argument/);
  });

  it('constructs amqp client when correct configuration is passed', async function test() {
    const client = new MailerClient(FakeAMQP);
    await client.ready();
  });
});
