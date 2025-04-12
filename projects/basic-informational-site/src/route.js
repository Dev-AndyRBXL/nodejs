import path from 'path';

export default function (app, rootDir) {
  app.get('/', (_, res) => {
    const filePath = path.resolve(rootDir, './public/index.html');
    res.sendFile(filePath);
  });

  app.get('/about', (_, res) => {
    const filePath = path.resolve(rootDir, './public/pages/about.html');
    res.sendFile(filePath);
  });

  app.get('/contact-me', (_, res) => {
    const filePath = path.resolve(rootDir, './public/pages/contact-me.html');
    res.sendFile(filePath);
  });

  app.use((_, res) => {
    const filePath = path.resolve(rootDir, './public/pages/404.html');
    res.status(404).sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending 404 file:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  });
}
