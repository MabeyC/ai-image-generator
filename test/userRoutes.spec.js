const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

// Import the Express app
const app = require('../server'); 

describe('File Routes',  () => {
  describe('POST /user', async () => {
    it('should register a new user and return a token', () => {
      const userData = {
        name: 'John Doe',
        email: 'jdoe@example.com',
        password: 'password123'
      };

      chai
        .request(app)
        .post('/user')
        .type('form')
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
        });
    });

    it('should return validation errors if request body is invalid', async () => {
      const userData = {
        name: '',
        email: 'invalidemail',
        password: 'short'
      };

      chai
        .request(app)
        .post('/user')
        .type('form')
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.an('array');
        });
    });

    it('should return an error if the user already exists', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123'
      };

      chai
        .request(app)
        .post('/user')
        .send(userData)
        .end(() => {
          chai
            .request(app)
            .post('/users')
            .send(userData)
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body.errors[0].message).to.equal('User already exists');
            });
        });
    });
  });
});
