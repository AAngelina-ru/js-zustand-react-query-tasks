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

  return async (req, res) => {
    const url = (req.url ?? '').split('?')[0]
    const method = req.method ?? 'GET'

    // GET /api/users
    if (method === 'GET' && url === '/api/users') {
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(200)
      res.end(JSON.stringify(users))
      return
    }

    // GET /api/users/:id
    const userMatch = url.match(/^\/api\/users\/([^/]+)$/)
    if (method === 'GET' && userMatch) {
      const user = users.find((item) => item.id === userMatch[1])
      if (!user) {
        res.setHeader('Content-Type', 'application/json')
        res.writeHead(404)
        res.end(JSON.stringify({ message: 'Not found' }))
        return
      }
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(200)
      res.end(JSON.stringify(user))
      return
    }

    // POST /api/users
    if (method === 'POST' && url === '/api/users') {
      let body = ''
      req.on('data', chunk => (body += chunk.toString()))
      req.on('end', () => {
        try {
          const { name } = JSON.parse(body)
          const id = (++currentId).toString()
          const newUser = { id, name }
          users.push(newUser)
          res.setHeader('Content-Type', 'application/json')
          res.writeHead(201)
          res.end(JSON.stringify(newUser))
        } catch (e) {
          res.setHeader('Content-Type', 'application/json')
          res.writeHead(400)
          res.end(JSON.stringify({ message: 'Invalid JSON' }))
        }
      })
      return // важно: не вызывать next(), запрос уже обработан
    }

    // DELETE /api/users/:id
    if (method === 'DELETE' && userMatch) {
      const id = userMatch[1]
      const initialLength = users.length
      users = users.filter((user) => user.id !== id)
      if (users.length === initialLength) {
        // не удалили (пользователя не было)
        res.setHeader('Content-Type', 'application/json')
        res.writeHead(404)
        res.end(JSON.stringify({ message: 'Not found' }))
        return
      }
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(200)
      res.end(JSON.stringify({ message: `User with id ${id} deleted` }))
      return
    }
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    middlewares: [setupUsersApi()],
    open: true,
  },
})
