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
const keys = ['title', 'subtitle', 'description', 'location', 'starts', 'ends', 'contact_name', 'contact_phone', 'contact_email', 'url']

const ensureAuth = require('../auth');

router.get("/", async (req, res, next) => {
	let auth = req.headers.authorization;
	if (!auth) return res.status(400).send("missing auth token");

	let token = auth.split(' ')[1];

	let level = req.query.level;

	let id = req.query.id;

	jwt.verify(token, jwtconfig.secret, async (err, decoded) => {
		if (err) return res.status(400).send("invalid auth token");

		// Only Level or Id, not both
		if (level) {
			let user = await Users.findById(decoded._id);

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
		}
		else if (id) {
			const event = await Events.findById(id)//.populate('access') // TODO: re enable???

			if (!event) return res.status(400).send("could not find event");

			try {
				return res.send(event);
			}
			catch (err) {
				return res.status(500).send(err);
			}
		}
		else {
			return res.status(400).send("missing level or id parameter");
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
			if (!user.rsos.includes(access)) {
				return res.status(400).send("you must be apart of the rso you want to make the event for");
			}

			let rso = await Rsos.findById(access);

			//console.log(rso.admin, user._id, rso.admin.toString() == user._id.toString());
			if (!rso.admin.equals(user._id)) {
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

			await Rsos.findByIdAndUpdate(access, { $push: { events: event._id } }, { useFindAndModify: false });

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

			await Schools.findByIdAndUpdate(access, { $push: { events: event._id } }, { useFindAndModify: false });

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

router.put("/:id", ensureAuth, async (req, res, next) => {
	//const { title, subtitle, description, location, starts, ends, contact_name, contact_phone, contact_email, url } = req.body;

	//let body = (req.body).filter(key => keys.includes(key));

	// removes any keys that are not listed in const keys
	// prob not strictly nessary as mongoose should handle this as well, but should 
	// 		prevent changing anything we dont want changed (access or access_type)
	let body = Object.keys(req.body)
		.filter(key => keys.includes(key))
		.reduce((res, key) => (res[key] = req.body[key], res), {});

	Events.findByIdAndUpdate(req.params.id, { ...body }, { useFindAndModify: false, new: true }, (err, _res) => {
		if (err) return res.status(400).send(err);

		res.send(_res);
	})
})

router.delete("/:id", ensureAuth, async (req, res, next) => {

	if (!req.params.id) return res.status(400).send("missing id");

	let event = await Events.findByIdAndDelete(req.params.id);

	if (!event) {
		return res.status(400).send("cound not remove")
	}

	// Remove refrence from any documents containing event
	if (event.access_type === "public") {
		return res.send("done");
	}
	else if (event.access_type === "school") {
		// remove refrence from school
		await Schools.findByIdAndUpdate(event.access, { $pull: { events: event._id } }, { useFindAndModify: false });

		return res.send("done");
	}
	else if (event.access_type === "rso") {
		// remove refrence from school
		await Rsos.findByIdAndUpdate(event.access, { $pull: { events: event._id } }, { useFindAndModify: false });

		return res.send("done");
	}
})



module.exports = router;
