import express from 'express';
import path from 'path';
import { createBundleRenderer } from 'vue-server-renderer';
import serverBundle from '../assets/server-bundle.json';
import template from '../assets/index.html';

import metatags from './metatags';

const renderer = createBundleRenderer(serverBundle, { template });
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.resolve(__dirname, '../../build')));
  app.use(express.static(path.resolve(__dirname, '../../public')));
}

app.get('*', (req, res) => {
  const context = { ...metatags(req.path, req.query), url: req.url };
  renderer.renderToString(context, (error, html) => {
    res.end(html);
  });
});

if (process.env.NODE_ENV === 'development') {
  app.listen(8080, () => console.log('listening port: 8080'));
}

export default app;
