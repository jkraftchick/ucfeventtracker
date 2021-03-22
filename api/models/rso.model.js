const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema
const RsoSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	admin: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true
	},
	school: { type: Schema.Types.ObjectId, ref: 'school' },
	students: [{ type: Schema.Types.ObjectId, ref: 'user' }],
	events: [{ type: Schema.Types.ObjectId, ref: 'event' }]
});

module.exports = mongoose.model('rso', RsoSchema);