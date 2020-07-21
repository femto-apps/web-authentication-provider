const Errors = require('@femto-apps/errors')('../errors.json')

const User = require('../models/User')

function readUsers() {
    return User.find({})
}

async function readUser(username) {
    const user = await User.findOne({ username: username })
        .catch(err => {
            throw Errors('ERR_USER_FIND', { username, err })
        })

    return user
}

async function readUserById(id) {
    const user = await User.findOne({ _id: id })
        .catch(err => {
            throw Errors('ERROR_USER_FIND_BY_ID', { idd, err })
        })

    return user
}

module.exports = {
    readUser,
    readUserById
}