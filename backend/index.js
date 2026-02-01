/**
 * Application entry: config, middleware, API routes.
 * API only; no static serving. Frontend is a separate app (frontend/).
 */

require('dotenv').config();
const express = require('express');
const { config } = require('./config');
const { requestId } = require('./middleware/requestId');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

app.use(requestId);
app.use(express.json({ limit: config.jsonBodyLimit }));

app.use(routes);

app.use((_req, _res, next) => next(Object.assign(new Error('Not found'), { status: 404 })));
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});
