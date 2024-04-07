const express = require("express");
const cors = require("cors");
const routerAuth = require("./src/router/authRouter");
const connectDB = require("./src/config/database");
const path = require("path");
const logger = require("morgan");
const {middlewareAuth} = require("./src/core/middleware");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT;
const corsOptions = {
    origin: process.env.CLIENT_URL,
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(middlewareAuth);

connectDB.connect();

app.use("/api/auth", routerAuth);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
