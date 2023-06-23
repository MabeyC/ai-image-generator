const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

// Import the Express app
const app = require('../server');

describe('Authentication Routes', () => {
  describe('GET /auth', () => {
    it('should return the authenticated user', async () => {
      const token = process.env.TEST_AUTH_TOKEN;

      chai
        .request(app)
        .get('/auth')
        .set('x-auth-token', `${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
        });
    });

    it('should return an error if token is missing or invalid', async () => {
      chai
        .request(app)
        .get('/auth')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
        });
    });
  });

  describe('POST /auth', () => {
    it('should authenticate the user and return a token', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      chai
        .request(app)
        .post('/auth')
        .send(credentials)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
        });
    });

    it('should return validation errors if request body is invalid', async () => {
      const credentials = {
        email: 'invalidemail',
        password: ''
      };

      chai
        .request(app)
        .post('/auth')
        .send(credentials)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.an('array');
        });
    });

    it('should return an error if the credentials are invalid', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      chai
        .request(app)
        .post('/auth')
        .send(credentials)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0].message).to.equal('Invalid Credentials');
        });
    });


  });
});
