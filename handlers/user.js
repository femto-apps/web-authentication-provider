const userService = require('../services/user')
const Errors = require('@femto-apps/errors')('../errors.json')

async function getUsers(req, res) {
	const users = await userService.readUsers()

    return res.json({
        users
    })
}

async function getUser(req, res) {
	const username = req.params.username
	const user = await userService.readUser(username)

	if (!user) {
		return res.status(404).json({ error: Errors('ERR_USER_FIND', { username }) })
	}

	return res.json(user)
}

async function getUserById(req, res) {
	const id = req.params.id
	const user = await userService.readUserById(id)

	if (!user) {
		return res.status(404).json({ error: Errors('ERR_USER_FIND_BY_ID', { id }) })
	}

	return res.json(user)
}

module.exports = {
	getUsers,
	getUser,
	getUserById
}
