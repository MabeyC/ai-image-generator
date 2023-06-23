const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

const app = require('../server'); 

describe('OpenAI Controller', () => {
  describe('POST /openai/generateimage', () => {
    it('should generate a single image', () => {
      const requestBody = {
        prompt: 'Create a single image of a web developer working with OpenAI',
        size: '256x256'
      };

      chai
        .request(app)
        .post('/openai/generateimage')
        .send(requestBody)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success').to.equal(true);
          expect(res.body).to.have.property('data').to.be.a('string');
        });
    });
  });

  describe('POST /openai/variantimage', () => {
    it('should generate variant images', () => {
      const requestBody = {
        name: 'image.png',
        size: '512x512',
        numVariants: 2
      };

      chai
        .request(app)
        .post('/openai/variantimage')
        .send(requestBody)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success').to.equal(true);
          expect(res.body).to.have.property('data').to.be.an('array');
          expect(res.body.data).to.have.lengthOf(2);
        });
    });
  });
});
