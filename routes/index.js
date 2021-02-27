const animeRouter = require('./animes');
const actorRouter = require('./actors');
const movieRouter = require('./movies');
const uploadRouter = require('./uploads');
const collectionRouter = require('./collections');
const collection2Router = require('./collection2');
const errorRouter = require('./errors');
const categoryRouter = require('./categories');
const hdrezkaRouter = require('./hdrezka');
const searchRouter = require('./search');
const updateRouter = require('./update');

const stop = (req, res, next) => {
    res.status(404).json({
        success: false,
    });
};

module.exports = (app) => {
    app.use('/api/animes', animeRouter);
    app.use('/api/uploads', uploadRouter);
    app.use('/api/collections', collectionRouter);
    app.use('/api/errors', errorRouter);

    // V2

    // app.use('/api/v2', stop);

    app.use('/api/v2/movies', movieRouter);
    app.use('/api/v2/categories', categoryRouter);
    app.use('/api/v2/actors', actorRouter);
    app.use('/api/v2/collections', collection2Router);
    app.use('/api/:version/hdrezka', hdrezkaRouter);
    app.use('/api/v2/search', searchRouter);
    app.use('/api/v2/update', updateRouter);
};
