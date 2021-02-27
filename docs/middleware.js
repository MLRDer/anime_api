function getProtocol(req) {
    var proto = req.connection.encrypted ? 'https' : 'http';
    // only do this if you trust the proxy
    proto = req.headers['x-forwarded-proto'] || proto;
    return proto.split(/\s*,\s*/)[0];
}

module.exports = (docs) => (req, _, next) => {
    console.log(getProtocol(req));
    docs.schemes = [getProtocol(req)];
    docs.host = req.get('host');
    req.swaggerDoc = docs;
    next();
};
