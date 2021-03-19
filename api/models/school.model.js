const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const SchoolSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	location: {
		type: {
			lat: Number,
			lng: Number
		}
	},
	description: {
		type: String
	},
	image: {
		type: String
	},

	students: [{ type: Schema.Types.ObjectId, ref: 'student' }],
	rsos: [{ type: Schema.Types.ObjectId, ref: 'rso' }],
	events: [{ type: Schema.Types.ObjectId, ref: 'event' }]
});

module.exports = mongoose.model('school', SchoolSchema);