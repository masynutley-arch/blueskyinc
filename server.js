import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://s.ytimg.com"],
      "frame-src": ["https://www.youtube.com", "https://www.youtube-nocookie.com"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "https://i.ytimg.com", "data:"]
    }
  },
  crossOriginEmbedderPolicy: false,
}));
app.use(morgan('dev'));
app.use(compression());

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir, { maxAge: '1h', etag: true }));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
