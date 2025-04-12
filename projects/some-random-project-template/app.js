const express = require('express');
const path = require('node:path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const links = [
  { href: '/', text: 'Home' },
  { href: '/about', text: 'About' },
];

const users = ['Rose', 'Cake', 'Biff'];

app.get('/', (req, res) => {
  res.status(200).render('index', { links, users });
});

const hostName = '127.0.0.1';
const port = 3000;
app.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}`);
});
