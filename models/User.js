const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    //permissions: { type: [String], required: true }, 
    data: { type: String, required: false }
}, {
    timestamps: true,
    strict: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password
        }
    }
})

UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next()

    bcrypt.hash(this.password, 12, (err, hash) => {
        if (err) return next('An unknown error occurred whilst hashing your password, sorry.')
        this.password = hash
        next()
    })
})

UserSchema.methods.compare = function (password, cb) {
    return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
module.exports.schema = UserSchema