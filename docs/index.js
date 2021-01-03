const main = require("./swagger.json");
const tags = require("./tags.json");

const animeRoutes = require("./routes/animes.json");
const collectionRoutes = require("./routes/collections.json");
const errorRoutes = require("./routes/errors.json");

const animeModels = require("./models/anime.json");
const collectionModels = require("./models/collection.json");
const errorModels = require("./models/error.json");

const paths = {
    ...animeRoutes,
    ...collectionRoutes,
    ...errorRoutes,
};

const definitions = {
    ...animeModels,
    ...collectionModels,
    ...errorModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
    host: process.env.BASE_URL,
};
