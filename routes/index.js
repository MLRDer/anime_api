const animeRouter = require("./animes");
const collectionRouter = require("./collections");
const uploadRouter = require("./uploads");

module.exports = (app) => {
    app.use("/api/animes", animeRouter);
    app.use("/api/uploads", uploadRouter);
    app.use("/api/collections", collectionRouter);
};
