module.exports = (docs) => (req, _, next) => {
    docs.schemes = [req.protocol];
    docs.host = req.get('host');
    req.swaggerDoc = docs;
    next();
};
