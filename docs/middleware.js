module.exports = (docs) => (req, _, next) => {
    docs.schemes = req.secure ? ['https'] : ['http'];
    docs.host = req.get('host');
    req.swaggerDoc = docs;
    next();
};
