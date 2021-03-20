const v1 = require('./v1');
const v2 = require('./v2');
const v3 = require('./v3');

const error = require('./errors');
const update = require('./update');

const stop = (req, res, next) => {
    res.status(404).json({
        success: false,
    });
};

module.exports = (app) => {
    // Others
    app.use('/api/errors', error);
    app.use('/api/updates', update);

    // V1
    app.use('/api', v1);

    // V2
    app.use('/api/v2', v2);

    // V3
    app.use(
        '/api/v3',
        (req, res, next) => {
            res.status(404).json({
                success: false,
            });
        },
        v3
    );
};
