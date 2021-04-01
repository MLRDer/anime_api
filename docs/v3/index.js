const main = require('./swagger.json');
const tags = require('./tags.json');

const hdrezkaRoutes = require('./routes/hdrezka.json');
const notificationsRoutes = require('./routes/notifications.json');
const moviesRoutes = require('./routes/movies.json');

const hdrezkaModels = require('./models/hdrezka.json');
const notificationsModels = require('./models/notifications.json');
const moviesModels = require('./models/movies.json');

const paths = {
    ...hdrezkaRoutes,
    ...notificationsRoutes,
    ...moviesRoutes,
};

const definitions = {
    ...hdrezkaModels,
    ...notificationsModels,
    ...moviesModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
};
