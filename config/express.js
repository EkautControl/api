const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { port } = require('./config');

const app = express();

app.set('port', port);

app.use(cors());
app.use(bodyParser.json());

require('../api/routes/beer')(app);
require('../api/routes/tank')(app);
require('../api/routes/user')(app);
require('../api/routes/production')(app);
require('../api/routes/temperature')(app);
require('../api/routes/activity')(app);

module.exports = () => app;
