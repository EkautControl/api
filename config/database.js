const mongoose = require('mongoose');
const { mongoURL } = require('./config');

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
