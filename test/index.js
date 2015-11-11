const chai = require('chai');
const { expect } = chai;

describe('MailerClient', function testSuite() {
  const MailerClient = require('../src');
  const FakeAMQP = {};

  it('throws on invalid configuration', function test() {
    expect(() => {
      return new MailerClient(FakeAMQP, { routes: 'no', prefix: 10 });
    }).to.throw(/ValidationError/);
  });

  it('throws on missing amqp client', function test() {
    expect(() => {
      return new MailerClient();
    }).to.throw(/amqp client must be passed as a first argument/);
  });

  it('constructs amqp client when correct configuration is passed', function test() {
    expect(() => {
      return new MailerClient(FakeAMQP);
    }).to.not.throw();
  });
});
