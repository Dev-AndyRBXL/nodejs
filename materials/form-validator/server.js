const express = require('express');
const app = express();
const path = require('node:path');
const usersRouter = require('./src/routes/usersRouter');
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/', usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
