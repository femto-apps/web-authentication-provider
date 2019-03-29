const mongoose = require('mongoose')

const ConsumerSchema = mongoose.Schema({
	name: {type: String, required: true, index: { unique: true }},
	description: {type: String, required: false},
	redirects: {type: [String], required: true}
}, {
	timestamps: true,
    strict: true	
})

module.exports = mongoose.model('Consumer', ConsumerSchema)
