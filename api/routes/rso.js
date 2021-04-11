var express = require("express");
var router = express.Router();

var jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt.config');

var Users = require('../models/user.model');
var Rsos = require('../models/rso.model');
var Schools = require('../models/school.model');

const ensureAuth = require('../auth');

// name: {
// 	type: String,
// 	required: true,
// 	unique: true
// },
// admin: {
// 	type: Schema.Types.ObjectId,
// 	ref: 'user',
// 	required: true
// },
// school: { type: Schema.Types.ObjectId, ref: 'school' },
// students: [{ type: Schema.Types.ObjectId, ref: 'user' }],
// events: [{ type: Schema.Types.ObjectId, ref: 'event' }]

router.post("/", async (req, res, next) => {
	const { name, admin, school, students } = req.body;
	_school = school

	let auth = req.headers.authorization;
	if (!auth) return res.status(400).send("missing auth token");

	let token = auth.split(' ')[1];

	jwt.verify(token, jwtconfig.secret, async (err, decoded) => {
		if (err) return res.status(400).send("invalid auth token");

		let user = await Users.findById(decoded._id);

		if (_school == null || _school == undefined) {
			_school = user.school;
		}

		if (user.role !== 'superadmin') {
			return res.status(400).send("no permissions to create rso");
		}

		let rso = new Rsos({
			name,
			admin,
			school: _school,
			students
		})

		rso.save();

		await Schools.findByIdAndUpdate(_school, { $push: { rsos: rso._id } }, { useFindAndModify: false, new: true });
		await Users.findByIdAndUpdate(decoded._id, { $push: { rsos: rso._id } }, { useFindAndModify: false, new: true });

		return res.send(rso);
	})
})

router.get("/", async (req, res, next) => {
	let auth = req.headers.authorization;
	if (!auth) return res.status(400).send("missing auth token");

	let token = auth.split(' ')[1];

	jwt.verify(token, jwtconfig.secret, async (err, decoded) => {
		if (err) return res.status(400).send("invalid auth token");

		let user = await Users.findById(decoded._id);



		Rsos.find({school:user.school}, {useFindAndModify:false}, (err, _res) => {
			if (err) return res.status(400).send(err);

			return res.send(_res);
		})
	})
})

router.patch("/join/:id", ensureAuth, async (req, res, next) => {
	if (!req.params.id) return res.status(400).send("missing id");

	Rsos.findByIdAndUpdate(req.params.id, { $push: { students: req.body.user } }, { useFindAndModify: false, new: true }, (dberr, dbres) => {
		if (dberr) return res.status(400).send(dberr);
		res.send(dbres);
	})
})

router.patch("/leave/:id", ensureAuth, async (req, res, next) => {
	if (!req.params.id) return res.status(400).send("missing id");

	Rsos.findByIdAndUpdate(req.params.id, { $pull: { students: req.body.user } }, { useFindAndModify: false, new: true }, (dberr, dbres) => {
		if (dberr) return res.status(400).send(dberr);
		res.send(dbres);
	})
})


module.exports = router;
