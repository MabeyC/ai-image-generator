const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

const app = require('../server'); 

describe('File Controller', () => {
  describe('POST /file/uploadimage', () => {
    it('should upload an image to the database', async () => {
      const file = {
        originalname: 'test.png',
        size: 1024,
        buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAAAaGVYSWZNTQAqAAAACAACknwAAgAAACkAAAAmkoYAAgAAABgAAABQ'),
        mimetype: 'image/png'
      };

      chai
        .request(app)
        .post('/file/uploadimage')
        .attach('file', file.buffer, file.originalname)
        .field('name', 'Test Image')
        .field('size', file.size)
        .field('mimetype', file.mimetype)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').to.equal(true);
          expect(res.body).to.have.property('message');
        });

    });
  });

  describe('GET /file/image/:filename', () => {
    it('should retrieve an image from the database', async () => {
      const filename = 'test.png';

      chai
        .request(app)
        .get(`/file/image/${filename}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').to.equal(true);
          expect(res.body).to.have.property('image');
        });

    });

    it('should return an error if the file does not exist', async () => {
      const filename = 'nonexistent.png';

      chai
        .request(app)
        .get(`/file/image/${filename}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('err').to.equal('No file exists');
        });

    });

    it('should return an error if the file is not an image', async () => {
      const filename = 'test.txt'; // Assuming a non-image file

      chai
        .request(app)
        .get(`/file/image/${filename}`)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('success').to.equal(false);
          expect(res.body).to.have.property('message').to.equal('Unable to save image');
        });

    });
  });
});
