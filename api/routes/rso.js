var express = require("express");
var router = express.Router();

var Rso = require('../models/rso.model');

router.post("/", async (req, res, next) => {
	const rso = new Rso(req.body);

	try {
		await rso.save();
		return res.send(rso);
	}
	catch (err) {
		return res.status(500).send(err);
	}
});

module.exports = router;
