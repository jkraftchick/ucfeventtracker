var express = require('express');
var jwt = require('jsonwebtoken');

const User = require('../models/user.model');

var router = express.Router();

router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	User.findOne({ username: username },
		async function (err, user) {

			if (err) return res.status(400).send(err);

			if (!user) return res.status(400).send('User does not exist');

			const match = password === user.password;
			if (!match) return res.status(400).send('Invalid credentials');

			jwt.sign({ _id: user._id }, 'secret', { expiresIn: '69 days' }, (err, token) => {
				if (err) return res.status(400).send(err);

				return res.json({
					token,

					user: {
						username: user.username,
						firstName: user.firstName,
						lastName: user.lastName
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

					jwt.sign({ _id: savedUser._id }, 'secret', { expiresIn: '69 days' }, (err, token) => {
						if (err) return res.status(400).send(err);

						return res.status(200).json({
							token,

							user: {
								firstName: savedUser.firstName,
								lastName: savedUser.lastName,
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


module.exports = router;