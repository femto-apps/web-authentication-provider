const LocalStrategy = require('passport-local').Strategy
const ObjectId = require('mongodb').ObjectId
const expressSession = require('express-session')
const MongoStore = require('connect-mongo')(expressSession)
const appendQuery = require('append-query')
const passport = require('passport')
const express = require('express')

const User = require('../models/User')

function authenticateUser(req, username, password, done) {
    User
        .findOne({ username })
        .then(user => {
            if (!user) return done(null, false, { message: 'Incorrect username.' })

            console.log(password, user.password)

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
    if (req.user) return next()

    res.redirect(appendQuery('/login', 'goto=' + encodeURIComponent(req.originalUrl)))
}

exports.postRegister = function(req, res, next) {
    console.log('here')
    User
        .findOne({ username: req.body.username })
        .then(existingUser => {
            console.log('here 2')
            if (existingUser) {
                req.flash('error', 'Username / Email already in use.')
                return res.redirect(req.originalUrl)
            }

            console.log('here 3')

            let user = new User({
                username: req.body.username,
                password: req.body.password
            })

            console.log('here 4')

            user.save().then(() => {
                req.login(user, err => {
                    console.log('here 5')
                    if (err) return next(err)
                    return res.redirect(decodeURIComponent(req.body.goto) || '/')
                })
            })
        })
}

exports.postLogin = (req, res, next) => {
    console.log('login 1')
    passport.authenticate('local', (err, user, info) => {
        console.log('login 2')
        if (err) {
            console.log('login 3')
            console.error(err)
            return req.flash('error', 'An unexpected error occurred.')
        }

        console.log('login 5')
        if (!user) {
            console.log('login 4')
            req.flash('error', info.message)

            if (req.body.goto) {
                console.log('login 6')
                return res.redirect(appendQuery(req.originalUrl, 'goto=' + encodeURIComponent(req.body.goto)))
            } else {
                console.log('login 7')
                return res.redirect(req.originalUrl)
            }
        }

        console.log('login 8')
        req.logIn(user, (err) => {
            console.log('login 9')
            if (err) return req.flash('error', err)
            return res.redirect(decodeURIComponent(req.body.goto) || '/')
        })
    })(req, res, next)
    console.log('login 10')
}

exports.getLogout = function(req, res) {
    console.log('logout 1')
    req.logout()
    console.log('logout 2')
    res.redirect('/')
    console.log('logout 3')
}