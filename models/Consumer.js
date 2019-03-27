const mongoose = require('mongoose')

const ConsumerSchema = mongoose.Schema({
	redirect: {type: [String], required: true, index: { unique: true }}, 
	name: {type: String, required: true, index: { unique: true }}
}, {
	timestamps: true,
    strict: true	
})

module.exports = mongoose.model('Consumer', ConsumerSchema)
