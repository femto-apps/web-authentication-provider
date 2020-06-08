const mongoose = require('mongoose')
const config = require('@femto-apps/config')

const UserSchema = require('../models/User').schema
const FileUploaderUserSchema = require('../../web-file-uploader/models/User').schema

// DISABLE HASHING BEFORE RUNNING THIS SCRIPT

const userConnection = mongoose.createConnection(config.get('mongo.uri') + config.get('mongo.db'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const fileUserConnection = mongoose.createConnection(config.get('mongo.uri') + 'fileUploader', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const minimalUserConnection = mongoose.createConnection(config.get('mongo.uri') + 'minimal_design', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const User = userConnection.model('User', UserSchema)
const FileUploaderUser = fileUserConnection.model('User', FileUploaderUserSchema)
const MinimalUser = minimalUserConnection.model('User', {
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    apiKey: { type: String }
})

async function convertUser(original) {
    console.log('handling', original._id)

    const user = new User({
        _id: original._id,
        username: original.username,
        password: original.password,
        createdAt: original.createdAt,
        updatedAt: original.updatedAt
    })

    const fileUser = new FileUploaderUser({
        user: original._id,
        createdAt: original.createdAt,
        updatedAt: original.updatedAt,
        apiKey: original.apiKey
    })

    console.log('saving user')

    try {
        await user.save()
    } catch(e) {
        if (e.code !== 11000) throw e
    }

    console.log('finished svaing user')
    console.log('saving file uploader user')

    try {
        await user.save()
    } catch(e) {
        if (e.code !== 11000) throw e
    }

    try {
        await fileUser.save()
    } catch(e) {
        if (e.code !== 11000) throw e
    }

    console.log('finished')
}

async function init() {
    const users = await MinimalUser.find()

    for (let user of users) {
        await convertUser(user)
    }
}

init()