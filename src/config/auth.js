const jwt = require('jsonwebtoken');

require('dotenv');
const authConfig = process.env.SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({error: 'no token provided'});

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({error: 'no have two parts', parts: parts});

    const [ scheme, token ] = parts;

    if (!/[Bearer$]/i.test(scheme))
        return res.status(401).send({ error : 'token wrong formatted!', parts: parts});

    jwt.verify(token, authConfig, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'token invalid'});

        req.userId = decoded.id;
        return next();
    });
}