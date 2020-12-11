const main = require('./swagger.json');
const tags = require('./tags.json');

const animeRoutes = require('./routes/animes.json');

const animeModels = require('./models/anime.json');

const paths = {
    ...animeRoutes,
};

const definitions = {
    ...animeModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
    host: process.env.BASE_URL,
};
