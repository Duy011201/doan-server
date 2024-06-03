const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");
const path = require("path");
const logger = require("morgan");
const { middlewareAuth } = require("./src/core/middleware");
const bodyParser = require("body-parser");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const routerAuth = require("./src/router/authRouter");
const routerUser = require("./src/router/userRouter");

require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT;
const corsOptions = {
  origin: process.env.CLIENT_URL,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100 // Giới hạn mỗi IP chỉ có thể gửi 100 yêu cầu trong mỗi 15 phút
});

app.use(limiter);
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(helmet());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(middlewareAuth);

connectDB.connect();

app.use('/api/auth', routerAuth);
// app.use("/api/user", routerUser);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
