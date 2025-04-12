import express from 'express';
import path from 'path';
import route from './src/route.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.resolve(__dirname, 'public')));

route(app, __dirname);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is up and running!');
});
