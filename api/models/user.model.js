const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		required: true,
		enum: ["student", "admin", "superadmin"]
	},
	school: { type: Schema.Types.ObjectId, ref: 'school' },
	rsos: [{ type: Schema.Types.ObjectId, ref: 'rso' }]
});

module.exports = mongoose.model('user', UserSchema);