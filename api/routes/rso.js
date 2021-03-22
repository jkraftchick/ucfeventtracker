var express = require("express");
var router = express.Router();

var jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt.config');

var Users = require('../models/user.model');
var Rsos = require('../models/rso.model');
var Schools = require('../models/school.model');

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

	let auth = req.headers.authorization;
	if (!auth) return res.status(400).send("missing auth token");

	let token = auth.split(' ')[1];

	jwt.verify(token, jwtconfig.secret, async (err, decoded) => {
		if (err) return res.status(400).send("invalid auth token");

		let user = await Users.findById(decoded._id);

		if (user.role !== 'superadmin') {
			return res.status(400).send("no permissions to create rso");
		}


		let rso = new Rsos({
			name,
			admin,
			school,
			students
		})

		rso.save();

		console.log(rso);

		Schools.findByIdAndUpdate(school, { $push: { rsos: rso._id } }, { useFindAndModify: false, new: true }, (err, res) => {
			console.log(err, res);
		});

		return res.send(rso);


	})
})

module.exports = router;
