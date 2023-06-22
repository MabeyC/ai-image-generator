const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(sinonChai);
chai.use(chaiHttp);

// Bring in express server
const app = require('../server');

describe('API Endpoints - openai', () => {

  describe('POST /openai/generateimage', () => {
    let body = { prompt: "test", n: 1, size: '256x256' };
    let invalidBody = { n: 1, size: '256x256' };
    
    it('should return status 200 when called', async () => {
      await chai
        .request(app)
        .post('/openai/generateimage')
        .send(body)
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.a('object');
          expect(response.body).to.have.property('success').eq(true);
          expect(response.body).to.have.property('data');
        });
    });

    it('should return status 400 when called with invalid input', async () => {
      await chai
        .request(app)
        .post('/openai/generateimage')
        .send(invalidBody)
        .end((err, response) => {
          expect(response).to.have.status(400);
          expect(response.body).to.be.a('object');
          expect(response.body).to.have.property('success').eq(false);
          expect(response.body).to.have.property('error');
        });
    });
  });

  describe('POST /openai/variantimage', () => {
    let body = { name: "garfield.png", numVariants: 1, size: '256x256' };
    let invalidBody = { numVariants: 1, size: '256x256' };

    it('should return status 200 when called', async () => {
      await chai
        .request(app)
        .post('/openai/variantimage')
        .send(body)
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.a('object');
          expect(response.body).to.have.property('success').eq(true);
          expect(response.body).to.have.property('data');
        });
    });
    it('should return status 400 when called with invalid input', async () => {
      await chai
        .request(app)
        .post('/openai/variantimage')
        .send(invalidBody)
        .end((err, response) => {
          expect(response).to.have.status(404);
          expect(response.body).to.be.a('object');
          expect(response.body).to.have.property('success').eq(false);
          expect(response.body).to.have.property('error');
        });
    });
  });
});
