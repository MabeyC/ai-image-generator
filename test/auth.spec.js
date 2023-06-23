const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const jwt = require('jsonwebtoken');
const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);

// Import the middleware function
const authMiddleware = require('../middleware/auth');

describe('Middleware - Auth', () => {
  it('should call the next middleware if the token is valid', () => {
    const req = {
      header: () => 'valid-token',
      user: null
    };

    const res = {};
    const next = sinon.spy();

    // Stub the jwt.verify function to return a valid decoded token
    sinon.stub(jwt, 'verify').returns({ user: { id: 'user-id' } });

    authMiddleware(req, res, next);

    expect(req.user).to.deep.equal({ id: 'user-id' });
    expect(next).to.have.been.calledOnce;

    // Restore the stubbed function
    jwt.verify.restore();
  });

  it('should return an error if no token is provided', () => {
    const req = {
      header: () => null
    };
  
    const res = {
      status: sinon.stub().returns({ json: sinon.spy() })
    };
  
    const next = sinon.spy();
  
    authMiddleware(req, res, next);
  
    expect(res.status).to.have.been.calledWith(401);
    expect(res.status).to.have.been.calledOnce;
    expect(next).to.not.have.been.called;
  });

  it('should return an error if the token is invalid', () => {
    const req = {
      header: () => 'invalid-token'
    };

    const res = {
      status: sinon.stub().returns({ json: sinon.spy() })
    };

    const next = sinon.spy();

    // Stub the jwt.verify function to throw an error
    sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

    authMiddleware(req, res, next);

    expect(res.status).to.have.been.calledWith(401);
    expect(res.status().json).to.have.been.calledWith({ message: 'Token is not valid' });
    expect(next).to.not.have.been.called;

    // Restore the stubbed function
    jwt.verify.restore();
  });
});
