// Permitted Image File Types
const allowedContentTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
// Image File Size Limits
const imageSizeLimitInBytes = Math.round(1048576 * 4);   // 4MB 

module.exports = { allowedContentTypes, imageSizeLimitInBytes };