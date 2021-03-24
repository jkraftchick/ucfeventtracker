const jwt = require('jsonwebtoken');
const jwtconfig = require('./config/jwt.config');

const ensureAuth = (req, res, next) => {
	let auth = req.headers.authorization;
	if (!auth) return res.status(400).send("missing auth token");

	let token = auth.split(' ')[1];

	jwt.verify(token, jwtconfig.secret, async (err, decoded) => {
		if (err) return res.status(400).send(err);

		req.headers.authorization = decoded;
		next()
	})
}

module.exports = ensureAuth;