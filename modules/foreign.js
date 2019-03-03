const uuidv4 = require('uuid/v4')
const appendQuery = require('append-query')

const Token = require('../models/Token')
const services = require('../data/services')

// contains 'id', 'redirect'
exports.getAuth = async function(req, res) {
    const { id, redirect } = req.query

    if (!(id in services)) {
        return res.json({ err: 'Invalid ID' })
    }

    let url
    try {
        url = new URL(redirect)
    } catch(e) {
        return res.json({ err: 'Unacceptable Redirect' })
    }
    
    if (!services[id].redirects.find(redirect => redirect === url.origin )) {
        return res.json({ err: 'Unacceptable Redirect' })
    }

    // generate a new token.
    const tokenId = uuidv4()
    
    const token = new Token({
        token: tokenId,
        user: req.user._id
    })

    await token.save()

    return res.redirect(appendQuery(redirect, 'token=' + encodeURIComponent(tokenId)))
}

exports.getVerify = async function(req, res) {
    const tokenId = req.query.token

    const token = await Token.findOne({ token: tokenId }).populate('user')

    if (!token) {
        return res.json({
            err: 'Unknown Token'
        })
    }

    return res.json(token.user)
}