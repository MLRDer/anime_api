const main = require("./swagger.json");
const tags = require("./tags.json");

const animeRoutes = require("./routes/animes.json");
const collectionRoutes = require("./routes/collections.json");

const animeModels = require("./models/anime.json");
const collectionModels = require("./models/collection.json");

const paths = {
    ...animeRoutes,
    ...collectionRoutes,
};

const definitions = {
    ...animeModels,
    ...collectionModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
    host: process.env.BASE_URL,
};
