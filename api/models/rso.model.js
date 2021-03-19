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
	students: [{ type: Schema.Types.ObjectId, ref: 'user' }],
});

module.exports = mongoose.model('rso', RsoSchema);