const userService = require('../services/user')

async function getUsers(req, res) {
	const users = await userService.readConsumers()

    return res.json({
        users
    })
}

async function getUser(req, res) {
	res.sendStatus(501)
}

module.exports = {
	getUsers,
	getUser
}
