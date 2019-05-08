const userService = require('../services/user')

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

module.exports = {
	getUsers,
	getUser
}
