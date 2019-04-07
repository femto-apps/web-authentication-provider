const mongoose = require('mongoose')

const ConsumerSchema = mongoose.Schema({
	uuid: {type: String, required: true, unique: true},
	name: {type: String, required: true, unique: true },
	description: {type: String, required: false},
	redirects: {type: [String], required: true}
}, {
	timestamps: true,
    strict: true	
})

module.exports = mongoose.model('Consumer', ConsumerSchema)
