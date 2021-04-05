const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const EventSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	subtitle: String,
	description: String,
	location: Schema.Types.Mixed,
	starts: Date,
	ends: Date,
	contact_name: String,
	contact_phone: String,
	contact_email: String,
	url: String,
	access_type: {
		type: String,
		required: true,
		enum: ['public', 'school', 'rso']
	},
	access: {
		type: Schema.Types.ObjectId,
		refPath: 'access_type'
	},

	users: [{ type: Schema.Types.ObjectId, ref: 'user' }]
});

module.exports = mongoose.model('event', EventSchema);