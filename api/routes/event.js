var express = require("express");
var router = express.Router();

var jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt.config');

const mongoose = require('mongoose');

var Events = require('../models/event.model');
var Users = require('../models/user.model');
var Rsos = require('../models/rso.model');
var Schools = require('../models/school.model');

const levels = ["public", "school", "rso"];

router.get("/", async (req, res, next) => {
	let auth = req.headers.authorization;
	if (!auth) return res.status(400).send("missing auth token");

	let token = auth.split(' ')[1];

	let level = req.query.level || "public";

	jwt.verify(token, jwtconfig.secret, async (err, decoded) => {
		if (err) return res.status(400).send("invalid auth token");

		let user = await Users.findById(decoded._id);
		console.log(user);

		if (!levels.includes(level)) {
			return res.status(400).send("Level must be public, school, or rso");
		}

		let search = { access_type: "public" }

		if (level === "school") {
			search = { $or: [{ access_type: "public" }, { access_type: "school", access: user.school }] }
		}
		else if (level === "rso") {
			search = { $or: [{ access_type: "public" }, { access_type: "school", access: user.school }, { access_type: "rso", access: { $in: user.rsos } }] }
		}


		const events = await Events.find(search)//.populate('access') // TODO: re enable???

		try {
			return res.send(events);
		}
		catch (err) {
			return res.status(500).send(err);
		}
	})
})

router.post("/", async (req, res, next) => {
	const { access_type, access, title, subtitle, description, location, starts, ends, contact_name, contact_phone, contact_email, url } = req.body;

	let auth = req.headers.authorization;
	if (!auth) return res.status(400).send("missing auth token");

	let token = auth.split(' ')[1];

	jwt.verify(token, jwtconfig.secret, async (err, decoded) => {
		if (err) return res.status(400).send("invalid auth token");

		let user = await Users.findById(decoded._id);
		console.log(user);

		if (user.role !== 'admin' && user.role !== 'superadmin') {
			return res.status(400).send("no permissions to create events");
		}

		if (access_type === 'rso') {
			if (user.role !== 'superadmin' || !user.rsos.includes(access)) {
				return res.status(400).send("you must be apart of the rso you want to make the event for");
			}

			let rso = await Rsos.findById(access);

			//console.log(rso.admin, user._id, rso.admin.toString() == user._id.toString());
			if (user.role !== 'superadmin' || !rso.admin.equals(user._id)) {
				return res.status(400).send("you must be the rso admin to create an event");
			}

			let event = new Events({
				title,
				subtitle,
				description,
				location,
				starts,
				ends,
				contact_name,
				contact_phone,
				contact_email,
				url,
				access_type: 'rso',
				access: rso._id
			})

			event.save();

			Rsos.findByIdAndUpdate(access, { $push: { events: event._id } }, { useFindAndModify: false });

			return res.send(event);
		}
		else if (access_type === 'school') {
			if (user.role !== "superadmin") {
				return res.status(400).send("you must be a super admin to create school events");
			}

			let school = await Schools.findById(access);

			let event = new Events({
				title,
				subtitle,
				description,
				location,
				starts,
				ends,
				contact_name,
				contact_phone,
				contact_email,
				url,
				access_type: 'school',
				access: school._id
			})

			event.save();

			Schools.findByIdAndUpdate(access, { $push: { events: event._id } }, { useFindAndModify: false }, (err, res) => {
				console.log(err, res);
			});

			return res.send(event);
		}
		else if (access_type === 'public') {
			if (user.role !== "superadmin") {
				return res.status(400).send("you must be a super admin to create public events");
			}

			let event = new Events({
				title,
				subtitle,
				description,
				location,
				starts,
				ends,
				contact_name,
				contact_phone,
				contact_email,
				url,
				access_type: 'public',
			})

			event.save();

			return res.send(event);
		}
	})
})

router.put("/:id", async (req, res, next) => {
	res.status(418).send("todo update");
})

router.delete("/:id", async (req, res, next) => {
	res.status(418).send("todo delete");
})
module.exports = router;
