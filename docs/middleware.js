module.exports = (docs) => (req, _, next) => {
    console.log(req.protocol);
    docs.schemes = [req.protocol];
    docs.host = req.get('host');
    req.swaggerDoc = docs;
    next();
};
