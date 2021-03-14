const main = require('./swagger.json');
const tags = require('./tags.json');

const hdrezkaRoutes = require('./routes/hdrezka.json');
const notificationsRoutes = require('./routes/notifications.json');

const hdrezkaModels = require('./models/hdrezka.json');
const notificationsModels = require('./models/notifications.json');

const paths = {
    ...hdrezkaRoutes,
    ...notificationsRoutes,
};

const definitions = {
    ...hdrezkaModels,
    ...notificationsModels,
};

module.exports = {
    ...main,
    tags,
    definitions,
    paths,
};
