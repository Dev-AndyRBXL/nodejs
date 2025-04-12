const fs = require('fs');
const path = require('path');

fs.mkdir(path.join(__dirname, '/test'), {}, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Folder created!');
});
