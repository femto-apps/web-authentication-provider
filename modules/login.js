const LocalStrategy = require('passport-local').Strategy
const ObjectId = require('mongodb').ObjectId
const expressSession = require('express-session')
const MongoStore = require('connect-mongo')(expressSession)
const appendQuery = require('append-query')
const passport = require('passport')
const express = require('express')
const { promisify } = require('util')
const redis = require('redis')
const config = require('@femto-apps/config')

const User = require('../models/User')

const client = redis.createClient()
const delAsync = promisify(client.del).bind(client)

client.on('error', err => {
    console.log(`Received error: ${err}`)
    process.exit(1)
})


function authenticateUser(req, username, password, done) {
    User
        .findOne({ username })
        .then(user => {
            if (!user) return done(null, false, { message: 'Incorrect username.' })

            user.compare(password).then(match => {
                if (!match) return done(null, false, { message: 'Incorrect password.' })

                user.save().then(() => {
                    user._id = String(user._id)

                    req.login(user, err => {
                        if (err) return next(err)

                        done(null, user)
                    })
                })
            })
        })
}

function serialiseUser(user, done) {
    done(null, String(user._id))
}

function deserialiseUser(id, done) {
    User
        .findOne({ _id: ObjectId(id) })
        .then(user => done(null, user))
        .catch(err => done(err))
}

exports.init = function(app) {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.use(new LocalStrategy({ passReqToCallback: true }, authenticateUser))

    passport.serializeUser(serialiseUser)
    passport.deserializeUser(deserialiseUser)
}

exports.isAuthenticated = function(req, res, next) {
    if (req.query.multi) {
        if (req.query.multi.toLowerCase() == "true") {
            req.query.multi = "false"
            res.redirect(appendQuery('/login', 'goto=' + encodeURIComponent(req.originalUrl)))
        }
    }

    if (req.user) return next()

    res.redirect(appendQuery('/login', 'goto=' + encodeURIComponent(req.originalUrl)))
}

exports.postRegister = function(req, res, next) {
    User
        .findOne({ username: req.body.username })
        .then(existingUser => {
            if (existingUser) {
                req.flash('error', 'Username / Email already in use.')
                return res.redirect(req.originalUrl)
            }

            let user = new User({
                username: req.body.username,
                password: req.body.password
            })

            user.save().then(() => {
                req.login(user, err => {
                    if (err) return next(err)
                    return res.redirect(decodeURIComponent(req.body.goto) || '/')
                })
            })
        })
}

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err)
            return req.flash('error', 'An unexpected error occurred.')
        }

        if (!user) {
            req.flash('error', info.message)

            if (req.body.goto) {
                return res.redirect(appendQuery(req.originalUrl, 'goto=' + encodeURIComponent(req.body.goto)))
            } else {
                return res.redirect(req.originalUrl)
            }
        }

        req.logIn(user, (err) => {
            if (err) return req.flash('error', err)
            return res.redirect(decodeURIComponent(req.body.goto) || '/')
        })
    })(req, res, next)
}

async function logout(req, res, to) {
    req.logout()

    if ('tokens' in req.session) {
        const tokens = req.session.tokens.map(token => `${config.get('redis.session')}:${token.token}`).join(' ')
        await delAsync(tokens)
        req.session.tokens = undefined
    }

    res.redirect(to || '/')
}

exports.getLogout = async function(req, res) {
    logout(req, res, req.query.to || '/')
}

exports.postLogout = async function(req, res) {
    logout(req, res, req.body.to || '/')
}
