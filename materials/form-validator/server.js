const express = require('express');
const path = require('node:path');
const app = express();
const usersRouter = require('./src/routes/usersRouter');

app.use(express.static(path.join(__dirname, 'src', 'views')));

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/', usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
