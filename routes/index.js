const animeRouter = require("./animes");

module.exports = (app) => {
    app.use("/api/animes", animeRouter);
};
