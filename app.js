const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
//const swagger = require('swagger-ui-express');
//const swaggerDocs = require('./docs');
const globalErrorHandler = require("./controllers/error");
const AppError = require("./utils/appError");
const indexRouter = require("./routes");

// Initialize express app
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
// app.use("/api/docs", swagger.serve, swagger.setup(swaggerDocs));

app.get("/", (_, res) =>
    res.send(
        '<div style="font-size: 48;font-family: Consolas; top: 50%; left: 50%; transform: translate(-50%, -50%); position: absolute;">⚠️ Do not use this route!</div>'
    )
);
indexRouter(app);

// 404 Error
app.all("*", (req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Error handling middleware
app.use(globalErrorHandler);

module.exports = app;
