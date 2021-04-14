var express = require("express");
var router = express.Router();

var jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt.config');

var School = require('../models/school.model');
var Users = require('../models/user.model');

var ensureAuth = require('../auth');

router.post("/", ensureAuth, async (req, res, next) => {
	const { name, location, description, image } = req.body;

	let user = await Users.findById(req.headers.authorization._id);

	if (user.role !== 'superadmin') {
		return res.status(400).send("no permissions to create school");
	}

	let school = new School({
		name,
		location,
		description,
		image
	})

	school.save();

	return res.send(school);
})

router.get("/:id", ensureAuth, async (req, res, next) => {
	const id = req.params.id;

	if (!id) return res.status(400).send("missing id param")

	let school = await School.findById(id)//.populate(['users', 'rsos', 'events']);

	return res.send(school);
})

router.get("/", ensureAuth, async (req, res, next) => {
	let school = await School.find({})//.populate(['users', 'rsos', 'events']);

	return res.send(school);
})



router.put("/:id", ensureAuth, async (req, res, next) => {
	const id = req.params.id;
	const { name, location, description, image } = req.body;

	if (!id) return res.status(400).send("missing id param");

	let school = await School.findByIdAndUpdate(id, {
		name,
		location,
		description,
		image
	}, { useFindAndModify: false, new: true })//.populate(['users', 'rsos', 'events']);

	return res.send(school);
})

router.delete("/:id", ensureAuth, async (req, res, next) => {
	const id = req.params.id;

	if (!id) return res.status(400).send("missing id param");

	//let school = await School.findByIdAndDelete(id);
	await School.findByIdAndDelete(id);

	return res.send(`School ${id} was successfuly deleted`);
})

router.patch("/join/:id", ensureAuth, async (req, res, next) => {
	if (!req.params.id) return res.status(400).send("missing id");

	School.findByIdAndUpdate(req.params.id, { $push: { students: req.body.user } }, { useFindAndModify: false, new: true }, (dberr, dbres) => {
		if (dberr) return res.status(400).send(dberr);
		//res.send(dbres);

		Users.findByIdAndUpdate(req.body.user, { school: req.params.id }, { useFindAndModify: false, new: true }, (dberr, dbres) => {
			if (dberr) return res.status(400).send(dberr);
			//res.send(dbres);
			return res.send('ok')
		})
	})

	
})

// router.patch("/leave/:id", ensureAuth, async (req, res, next) => {
// 	if (!req.params.id) return res.status(400).send("missing id");

// 	School.findByIdAndUpdate(req.params.id, { $pull: { students: req.body.user } }, { useFindAndModify: false, new: true }, (dberr, dbres) => {
// 		if (dberr) return res.status(400).send(dberr);
// 		res.send(dbres);
// 	})
// })

module.exports = router;
