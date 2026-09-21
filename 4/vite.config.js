import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import bodyParser from 'body-parser';

const setupUsersApi = () => {
  const jsonParser = bodyParser.json();
  let users = [
    { id: '1', name: 'Ann' },
    { id: '2', name: 'Bob' },
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
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const setupUsersApi = () => {
  let users = [
    { id: '1', name: 'Ann' },
    { id: '2', name: 'Bob' },
  ]
  let currentId = users.length

  return (req, res, next) => {
    const url = (req.url ?? '').split('?')[0]
    const method = req.method ?? 'GET'

    // Парсим JSON вручную только для POST
    if (method === 'POST' && url === '/api/users') {
      let body = ''
      req.on('data', chunk => (body += chunk))
      req.on('end', () => {
        let payload
        try {
          payload = JSON.parse(body)
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: 'Invalid JSON' }))
          return
        }

        const { name } = payload
        if (!name) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ message: 'Missing name' }))
          return
        }

        const id = (++currentId).toString()
        const newUser = { id, name }
        users.push(newUser)

        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(newUser))
      })
      return // важно: не вызывать next() после начала чтения потока
    }

    if (method === 'GET' && url === '/api/users') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(users))
      return
    }

    const userMatch = url.match(/^\/api\/users\/([^/]+)$/)
    if (!userMatch) {
      next()
      return
    }
    const id = userMatch[1]

    if (method === 'GET') {
      const user = users.find(u => u.id === id)
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Not found' }))
        return
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(user))
      return
    }

    if (method === 'DELETE') {
      users = users.filter(u => u.id !== id)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: `User with id ${id} deleted` }))
      return
    }

    next()
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'users-api',
      configureServer(server) {
        server.middlewares.use(setupUsersApi())
      },
    },
  ],
  server: {
    open: true,
  },
})
