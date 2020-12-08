const animeRouter = require("./animes");
const uploadRouter = require("./uploads");

module.exports = (app) => {
    app.use("/api/animes", animeRouter);
    app.use("/api/uploads", uploadRouter);
};
