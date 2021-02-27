const main = require('./swagger.json');
const tags = require('./tags.json');

const hdrezkaRoutes = require('./routes/hdrezka.json');

const hdrezkaModels = require('./models/hdrezka.json');

const paths = {
    ...hdrezkaRoutes,
};

const definitions = {
    ...hdrezkaModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
};
