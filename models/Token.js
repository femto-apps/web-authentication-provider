const mongoose = require('mongoose')

const TokenSchema = mongoose.Schema({
    token: { type: String, required: true, index: { unique: true }},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    strict: true
})

TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 })

module.exports = mongoose.model('Token', TokenSchema)
