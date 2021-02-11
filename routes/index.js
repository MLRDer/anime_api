const animeRouter = require("./animes");
const actorRouter = require("./actors");
const movieRouter = require("./movies");
const uploadRouter = require("./uploads");
const collectionRouter = require("./collections");
const collection2Router = require("./collection2");
const errorRouter = require("./errors");
const categoryRouter = require("./categories");
const hdrezkaRouter = require("./hdrezka");

module.exports = (app) => {
    app.use("/api/animes", animeRouter);
    app.use("/api/actors", actorRouter);
    app.use("/api/movies", movieRouter);
    app.use("/api/uploads", uploadRouter);
    app.use("/api/collections", collectionRouter);
    app.use("/api/errors", errorRouter);
    app.use("/api/categories", categoryRouter);
    app.use("/api/v2/collections", collection2Router);
    app.use("/api/v2/hdrezka", hdrezkaRouter);
};
