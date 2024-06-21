const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/database");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const helmet = require('helmet');
const {middlewareAuth} = require("./src/core/middleware");
const rateLimit = require('express-rate-limit');

const routerAuth = require("./src/router/authRouter");
const routerUser = require("./src/router/userRouter");
const routerRole = require("./src/router/roleRouter");
const routerCompany = require("./src/router/companyRouter");
const routerBlog = require("./src/router/blogRouter");
const uploadRole = require("./src/router/storeRouter");

require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors({origin: process.env.CLIENT_URL}));

// TODO remove rateLimit for develop test
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// }));
app.use(logger("dev"));
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/store", uploadRole);

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

// TODO remove middleware for display image
// app.use(middlewareAuth);

connectDB.connect();

app.use('/api/auth', routerAuth);
app.use("/api/admin/user", routerUser);
app.use("/api/role", routerRole);
app.use("/api/admin/company", routerCompany);
app.use("/api/admin/blog", routerBlog);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
