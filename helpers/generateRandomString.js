module.exports = function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789_';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }