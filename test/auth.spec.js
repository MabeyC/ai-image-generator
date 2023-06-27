const { expect } = require('chai');
const sinon = require('sinon');
const { authSession } = require('../middleware/auth');

describe('Auth Session Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      session: {
        userId: '0123456789' // Set the userId for a valid session
      }
    };
    res = {};
    next = sinon.spy();
  });

  it('should call next if the session is valid', () => {
    authSession(req, res, next);
    expect(next).to.have.been.calledOnceWithExactly();
  });

  it('should throw an error with status code 401 if the session is invalid', () => {
    req.session.userId = null; // Set userId to null to simulate an invalid session
    const expectedError = new Error('Invalid session');
    expectedError.statusCode = 401;

    expect(() => authSession(req, res, next)).to.throw(expectedError);
    expect(next).to.not.have.been.called;
  });
});
