module.exports = (docs) => (req, _, next) => {
    console.log(req.connection.encrypted);
    docs.schemes = req.connection.encrypted ? ['https'] : ['http'];
    docs.host = req.get('host');
    req.swaggerDoc = docs;
    next();
};
