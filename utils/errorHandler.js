// Error handling middleware
const errorHandler = (err, req, res) => {
  const { statusCode, message } = err;
  // Log the error
  if(statusCode) {
    console.log(`Status: ${statusCode} Message: ${message}`);
    // Set the response status code and send the error message
    return res.status(statusCode).json({ success: false, error: message });
  } 
  else {
    // Default error handling
    console.log(err.message);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { errorHandler };