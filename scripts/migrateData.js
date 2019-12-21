const mongoose = require('mongoose')
const config = require('@femto-apps/config')

const User = require('../models/User')
const FileUploaderUser = require('../../web-file-uploader/models/User')

// mongoose.connect(config.get('mongo.uri') + config.get('mongo.db'), {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// })

mongoose.connect(config.get('mongo.uri') + 'fileUploader', {
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true
})

// DISABLE HASHING BEFORE RUNNING THIS SCRIPT.

async function convertUser(original) {
    console.log('original', original)

    // const user = new User({
    //     _id: original._id,
    //     username: original.username,
    //     password: original.password,
    //     createdAt: original.createdAt,
    //     updatedAt: original.updatedAt
    // })

    console.log(config.get('mongo.uri') + 'fileUploader')

    const fileUser = new FileUploaderUser({
        user: original._id,
        createdAt: original.createdAt,
        updatedAt: original.updatedAt,
        apiKey: original.apiKey
    })

    console.log('created file uploader')

    // await user.save()
    await fileUser.save()

    console.log('finished')
}

convertUser({
    "_id": "5b41127aa1fe2d0534e856ad",
    "username": "popey545@debenclipper.com",
    "password": "$2a$12$7jWFan7fGdECjd1FJc0jr.uhNtJejm/wV6.VSt6f1CBvo.7c9/w5u",
    "createdAt": "2018-07-07T19:20:26.735Z",
    "updatedAt": "2018-07-07T19:20:26.735Z",
    "apiKey": "5c8ac325-b644-4a5a-ac68-29140fea44a9",
    "__v": 0
})