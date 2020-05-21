const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./api');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use('/api', api);

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});


export default app;
