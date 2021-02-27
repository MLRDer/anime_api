const main = require('./swagger.json');
const tags = require('./tags.json');

const animeRoutes = require('./routes/animes.json');
const collectionRoutes = require('./routes/collections.json');
const errorRoutes = require('./routes/errors.json');
const hdrezkaRoutes = require('./routes/hdrezka.json');

const animeModels = require('./models/anime.json');
const collectionModels = require('./models/collection.json');
const errorModels = require('./models/error.json');
const hdrezkaModels = require('./models/hdrezka.json');

const paths = {
    ...animeRoutes,
    ...collectionRoutes,
    ...errorRoutes,
    ...hdrezkaRoutes,
};

const definitions = {
    ...animeModels,
    ...collectionModels,
    ...errorModels,
    ...hdrezkaModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
};
