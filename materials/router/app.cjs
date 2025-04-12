const express = require('express');
const app = express();

// Routes
const authorRouter = require('./routes/authorRouter');
// route 2
// route 3
// ...

app.use('/authors', authorRouter);

app.get('/', (req, res) => {
  res.status = 200;
  res.send('Welcome to the homepage!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`My first expressJS app - listening on port ${port}!`);
});
