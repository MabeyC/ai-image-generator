const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const mongoose = require('mongoose');
const { expect } = chai;
chai.use(sinonChai);

const { connectDB } = require('../config/db');

describe('MongoDB Connection', () => {
  let mongooseConnectStub;
  let consoleLogStub;

  before(() => {
    // Stub the mongoose.connect function
    mongooseConnectStub = sinon.stub(mongoose, 'connect');
    // Stub console.log to prevent output during tests
    consoleLogStub = sinon.stub(console, 'log');
  });

  after(() => {
    // Restore the original functions after tests
    mongooseConnectStub.restore();
    consoleLogStub.restore();
  });

  it('should connect to MongoDB successfully', async () => {
    // Stub the mongoose.connect function to resolve successfully
    mongooseConnectStub.resolves({
      connection: {
        host: 'http://*.mongodb.net',
      },
    });

    await connectDB();

    expect(mongooseConnectStub).to.have.been.calledOnce;
    expect(consoleLogStub).to.have.been.calledWith('MongoDB connected: http://*.mongodb.net');
  });

  it('should handle MongoDB connection error', async () => {
    // Stub the mongoose.connect function to reject with an error
    const error = new Error('MongoDB connection failed');
    mongooseConnectStub.rejects(error);

    await connectDB();

    expect(consoleLogStub).to.have.been.calledWith(`MongoDB Error: ${error}`);
  });
});