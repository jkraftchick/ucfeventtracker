var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const jwtconfig = require('../config/jwt.config');

router.get("/self", (req, res, next) => {
	let auth = req.headers.authorization;
	if (!auth) return res.status(400).send("missing auth token");

	let token = auth.split(' ')[1];

	jwt.verify(token, jwtconfig.secret, async (err, decoded) => {
		if (err) return res.status(400).send("invalid auth token");

		let user = await User.findById(decoded._id);
		console.log(user);

		return res.send(user);
	})
})

router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	User.findOne({ username: username },
		async function (err, user) {

			if (err) return res.status(400).send(err);

			if (!user) return res.status(400).send('User does not exist');

			const match = password === user.password;
			if (!match) return res.status(400).send('Invalid credentials');

			jwt.sign({ _id: user._id }, jwtconfig.secret, (err, token) => { //, { expiresIn: '69 days' }
				if (err) return res.status(400).send(err);

				return res.json({
					token,

					user: {
						username: user.username,
						firstName: user.firstName,
						lastName: user.lastName,
						role: user.role,
						_id: user._id
					}
				});
			});
		});
});

router.post('/signup', async (req, res) => {
	const { firstName, lastName, username, password } = req.body;

	// Simple validation
	if (!firstName || !lastName || !username || !password) {
		return res.status(400).json({ msg: 'Please enter all fields' });
	}

	// Create User
	try {
		User.findOne({ username: username },
			async function (err, user) {
				try {
					if (err) return res.status(400).send(err);

					if (user) return res.status(400).send('User already exists');

					// TODO: decide on security or not... prob not lol
					//const salt = await bcrypt.genSalt(10);
					//if (!salt) return res.status(400).send('Bcrypt salt error');

					//const hash = await bcrypt.hash(password, salt);
					//if (!hash) return res.status(400).send('Bcrypt hash error');

					const newUser = new User({
						firstName,
						lastName,
						username,
						password,
						role: "student"
					});

					const savedUser = await newUser.save();
					if (!savedUser) return res.status(400).send('Something went wrong saving the user');

					jwt.sign({ _id: savedUser._id }, jwtconfig.secret, { expiresIn: '69 days' }, (err, token) => {
						if (err) return res.status(400).send(err);

						return res.status(200).json({
							token,

							user: {
								username: savedUser.username,
								firstName: savedUser.firstName,
								lastName: savedUser.lastName,
								role: savedUser.role,
								_id: user._id
							}
						});
					});

				} catch (e) {
					res.status(400).json({ err: e.message });
				}
			});
	} catch (e) {
		res.status(400).json({ err: e.message });
	}
});

router.post('/upgrade', (req, res) => {
	// TODO: add a masterpassword so that not anyone can upgrade
	const { username, role } = req.body;

	// Simple validation
	if (!username || !level) {
		return res.status(400).json({ msg: 'Please enter all fields' });
	}


	User.findOneAndUpdate({ username: username }, { role: role }, { new: true, useFindAndModify: false }, (err, user) => {
		if (err) return res.status(400).body(err);

		return res.send(user);
	});


});

// we're crashing at a nonexstant id here lol
router.get("/:id", async (req, res, next) => {
	if (!req.params.id) return res.status(400).send("missing id");

	User.findById(req.params.id, (dberr, dbres) => {
		if (dberr) return res.status(400).send(dberr);
		res.send({
			firstName: dbres.firstName,
			lastName: dbres.lastName
		});
	})
})

module.exports = router;
