var express = require("express");
var router = express.Router();

var School = require('../models/school.model');

router.post("/", async (req, res, next) => {
	const school = new School(req.body);

	try {
		await school.save();
		return res.send(school);
	}
	catch (err) {
		return res.status(500).send(err);
	}
});

module.exports = router;
