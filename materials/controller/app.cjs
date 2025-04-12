const express = require('express');
const authorRouter = require('./authorRouter.js');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Hello from HTML route!</h1>');
});

app.use('/authors', authorRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: {
      name: err.name || 'InternalServerError',
      message: err.message,
    },
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
 