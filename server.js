const express = require('express');
const cors = require('cors');
const routerAuth = require('./src/router/authRouter');
const connectDB = require("./src/config/database");
const logRequest = require('./src/common/log-request');

require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logRequest);

connectDB.connect();

app.use('/auth', routerAuth);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
