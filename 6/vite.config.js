import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import bodyParser from 'body-parser';

const setupUsersApi = () => {
  const jsonParser = bodyParser.json();
  let users = [
    { id: '1', name: 'Ann' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Alice' },
  ];
  let currentId = users.length;

  return (req, res, next) => {
    const url = (req.url ?? '').split('?')[0];

    if (req.method === 'GET' && url === '/api/users') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(users));
      return;
    }

    const userMatch = url.match(/^\/api\/users\/([^/]+)$/);

    if (req.method === 'GET' && userMatch) {
      const user = users.find((item) => item.id === userMatch[1]);
      res.setHeader('Content-Type', 'application/json');
      if (!user) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Not found' }));
        return;
      }
      res.end(JSON.stringify(user));
      return;
    }

    if (req.method === 'POST' && url === '/api/users') {
      jsonParser(req, res, () => {
        const { name } = req.body;
        const id = (++currentId).toString();
        const newUser = { id, name };
        users.push(newUser);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(newUser));
      });
      return;
    }

    if (req.method === 'DELETE' && userMatch) {
      const id = userMatch[1];
      users = users.filter((user) => user.id !== id);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: `User with id ${id} deleted` }));
      return;
    }

    next();
  };
};

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'users-api',
      configureServer(server) {
        server.middlewares.use(setupUsersApi());
      },
    },
  ],
  server: {
    open: true,
  },
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'users-api',
      configureServer(server) {
        // Храним данные в замыкании (для локального мока)
        let users = [
          { id: '1', name: 'Ann' },
          { id: '2', name: 'Bob' },
          { id: '3', name: 'Alice' },
        ];
        let currentId = users.length;

        server.middlewares.use((req, res, next) => {
          const url = (req.url ?? '').split('?')[0];

          // GET /api/users
          if (req.method === 'GET' && url === '/api/users') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(users));
            return;
          }

          // GET /api/users/:id
          const userMatch = url.match(/^\/api\/users\/([^/]+)$/);
          if (req.method === 'GET' && userMatch) {
            const user = users.find((u) => u.id === userMatch[1]);
            res.setHeader('Content-Type', 'application/json');
            if (!user) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Not found' }));
              return;
            }
            res.end(JSON.stringify(user));
            return;
          }

          // POST /api/users (парсим тело вручную)
          if (req.method === 'POST' && url === '/api/users') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              try {
                const { name } = JSON.parse(body);
                if (!name) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: 'Name is required' }));
                  return;
                }
                const id = (++currentId).toString();
                const newUser = { id, name };
                users.push(newUser);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newUser));
              } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
              }
            });
            return; // важно: не вызывать next()
          }

          // DELETE /api/users/:id
          if (req.method === 'DELETE' && userMatch) {
            const id = userMatch[1];
            const initialLength = users.length;
            users = users.filter(u => u.id !== id);
            res.setHeader('Content-Type', 'application/json');
            if (users.length === initialLength) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Not found' }));
              return;
            }
            res.end(JSON.stringify({ message: `User with id ${id} deleted` }));
            return;
          }

          next();
        });
      },
    },
  ],
  server: {
    open: true,
  },
});
