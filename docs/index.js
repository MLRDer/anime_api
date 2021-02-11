const main = require("./swagger.json");
const tags = require("./tags.json");

const animeRoutes = require("./routes/animes.json");
const collectionRoutes = require("./routes/collections.json");
const collection2Routes = require("./routes/collection2.json");
const errorRoutes = require("./routes/errors.json");
const categoryRoutes = require("./routes/categories.json");
const actorRoutes = require("./routes/actor.json");
const movieRoutes = require("./routes/movies.json");
const hdrezkaRoutes = require("./routes/hdrezka.json");

const animeModels = require("./models/anime.json");
const collectionModels = require("./models/collection.json");
const collection2Models = require("./models/collection2.json");
const errorModels = require("./models/error.json");
const categoryModels = require("./models/category.json");
const actorModels = require("./models/actor.json");
const movieModels = require("./models/movies.json");
const hdrezkaModels = require("./models/hdrezka.json");

const paths = {
    ...animeRoutes,
    ...collectionRoutes,
    ...errorRoutes,
    ...categoryRoutes,
    ...actorRoutes,
    ...movieRoutes,
    ...collection2Routes,
    ...hdrezkaRoutes,
};

const definitions = {
    ...animeModels,
    ...collectionModels,
    ...errorModels,
    ...categoryModels,
    ...actorModels,
    ...movieModels,
    ...collection2Models,
    ...hdrezkaModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
    host: process.env.BASE_URL,
};
