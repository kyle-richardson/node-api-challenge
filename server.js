const express = require('express');
const server = express();
const cors = require('cors')
const actionRouter = require('./routers/actionRouter');
const projectRouter = require('./routers/projectRouter');
server.use(cors())
server.use(express.json())
server.use(logger)
server.use('/api/action', actionRouter);
server.use('/api/project', projectRouter);



server.get('/', (req, res) => {
  res.send(`<h2>Working API!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'origin'
    )}`
  );

  next();
}

module.exports = server;
