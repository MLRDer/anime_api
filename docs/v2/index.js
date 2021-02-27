const main = require('./swagger.json');
const tags = require('./tags.json');

const collectionRoutes = require('./routes/collection.json');
const errorRoutes = require('./routes/errors.json');
const categoryRoutes = require('./routes/categories.json');
const actorRoutes = require('./routes/actor.json');
const movieRoutes = require('./routes/movies.json');
const hdrezkaRoutes = require('./routes/hdrezka.json');

const collectionModels = require('./models/collection.json');
const errorModels = require('./models/error.json');
const categoryModels = require('./models/category.json');
const actorModels = require('./models/actor.json');
const movieModels = require('./models/movies.json');
const hdrezkaModels = require('./models/hdrezka.json');

const paths = {
    ...collectionRoutes,
    ...errorRoutes,
    ...categoryRoutes,
    ...actorRoutes,
    ...movieRoutes,
    ...hdrezkaRoutes,
};

const definitions = {
    ...collectionModels,
    ...errorModels,
    ...categoryModels,
    ...actorModels,
    ...movieModels,
    ...hdrezkaModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
    schemes: process.env.NODE_ENV == 'development' ? ['http'] : ['https'],
    host:
        process.env.NODE_ENV == 'development'
            ? process.env.BASE_URL_DEV
            : process.env.BASE_URL_PROD,
};
