const { expect } = require('chai');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../server.js');
const { authSession } = require('../middleware/auth');
const User = require('../models/UserModel');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

/**
 * GET /auth
 *
 * @description returns a userid if the user has an authenticated session, otherwise returns an error message
 * 
 * POST / auth
 * @description Login route
 * @description accepts email and password, and returns a valid session cookie
 * 
 */


describe('Auth Routes', () => {
  let agent;

  before(() => {
    agent = chai.request.agent(app);
  });

  describe('GET /auth', () => {
    before(() => {
      // It should login the user and receive a session cookie
    });
    it('should return the userId', async () => {
      // send email and password
      // check if there is a valid session cookie
      // return the userId to the client
    });

    it('should return status 401 if invalid credentials are provided', async () => {
      // If either the email or password are not valid, return a status of 401 and an error message saying 'Unauthorized'
    });
  });

  describe('POST /auth', () => {
    it('should authenticate the user and return the userId', async () => {
      const email = 'jdoe@example.com';
      const password = '123456789';
      const user = {
        id: '0123456789abcdefg',
        name: 'John Doe',
        email,
        password: await bcrypt.hash(password, 10),
      };
      const findOneStub = sinon.stub(User, 'findOne').resolves(user);
      const compareStub = sinon.stub(bcrypt, 'compare').resolves(true);

      const res = await agent.post('/auth').send({ email, password });

      expect(findOneStub).to.have.been.calledOnceWith({ email });
      expect(compareStub).to.have.been.calledOnceWith(password, user.password);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('userId', user.id);

      findOneStub.restore();
      compareStub.restore();
    });

    it('should return invalid credentials if the user is not found', async () => {
      const email = 'jdoe@example.com';
      const password = 'password123';
      const findOneStub = sinon.stub(User, 'findOne').resolves(null);

      const res = await agent.post('/auth').send({ email, password });

      expect(findOneStub).to.have.been.calledOnceWith({ email });
      expect(res).to.have.status(400);
      expect(res.body.errors[0]).to.have.property('message', 'Invalid Credentials');

      findOneStub.restore();
    });

    it('should return invalid credentials if the password is incorrect', async () => {
      const email = 'jdoe@example.com';
      const password = 'password123';
      const user = {
        id: '0123456789',
        name: 'John Doe',
        email,
        password: await bcrypt.hash('differentpassword', 10),
      };
      const findOneStub = sinon.stub(User, 'findOne').resolves(user);
      const compareStub = sinon.stub(bcrypt, 'compare').resolves(false);

      const res = await agent.post('/auth').send({ email, password });

      expect(findOneStub).to.have.been.calledOnceWith({ email });
      expect(compareStub).to.have.been.calledOnceWith(password, user.password);
      expect(res).to.have.status(400);
      expect(res.body.errors[0]).to.have.property('message', 'Invalid Credentials');

      findOneStub.restore();
      compareStub.restore();
    });

    it('should return a 400 status if no params are sent', async () => {
      // TODO
    });
  });

  after(() => {
    agent.close();
  });
});
