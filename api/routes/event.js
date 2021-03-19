var express = require("express");
var router = express.Router();

var Event = require('../models/event.model');

router.post("/", async (req, res, next) => {
	const event = new Event(req.body);

	try {
		await event.save();
		return res.send(event);
	}
	catch (err) {
		return res.status(500).send(err);
	}
});

router.get("/", async (req, res, next) => {
	const events = await Event.find({}).populate('access')

	try {
		return res.send(events);
	}
	catch (err) {
		return res.status(500).send(err);
	}
})

module.exports = router;
