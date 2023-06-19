function convertBytes(bytes, unit) {
  if (unit === 'KB') {
    return Number((bytes / 1024).toFixed(2));
  } else if (unit === 'MB') {
    return Number((bytes / (1024 * 1024)).toFixed(2));
  } else {
    return Number(bytes);
  }
}

function convertMegaBytesToBytes(megaBytes){
  return Number(Math.round(megaBytes / 1048576).toFixed(2));
}

module.exports = { convertBytes, convertMegaBytesToBytes };