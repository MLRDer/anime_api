const main = require("./swagger.json");
const tags = require("./tags.json");

const animeRoutes = require("./routes/animes.json");
const collectionRoutes = require("./routes/collections.json");
const errorRoutes = require("./routes/errors.json");
const categoryRoutes = require("./routes/categories.json");

const animeModels = require("./models/anime.json");
const collectionModels = require("./models/collection.json");
const errorModels = require("./models/error.json");
const categoryModels = require("./models/category.json");

const paths = {
    ...animeRoutes,
    ...collectionRoutes,
    ...errorRoutes,
    ...categoryRoutes,
};

const definitions = {
    ...animeModels,
    ...collectionModels,
    ...errorModels,
    ...categoryModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
    host: process.env.BASE_URL,
};
