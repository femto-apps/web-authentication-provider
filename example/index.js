const expressSession = require('express-session')
const MongoStore = require('connect-mongo')(expressSession)
const MongoClient = require('mongodb').MongoClient
const fetch = require('node-fetch')
const express = require('express')

;(async () => {
    const app = express()
    const port = 3002

    const db = (await MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })).db('custom_db')

    app.set('view engine', 'pug')

    app.use(express.static('public'))
    app.use(expressSession({
        secret: process.env.PG_SECRET || 'super_secret_123',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ db }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 * 4 // 28 days
        }
    }))
    app.use((req, res, next) => {
        req.user = req.session.user
        next()
    })

    app.get('/', (req, res) => {
        console.log('hello', req.user)
        res.render('home', { user: req.user } )
        console.log(req.session)
    })
    app.get('/login', (req, res) => {
        console.log('redirecting')
        res.redirect('http://localhost:3001/api/auth?id=100&redirect=http://localhost:3002/login_callback')
        console.log('redirected')
    })
    app.get('/login_callback', (req, res) => {
        const { token } = req.query

        console.log('verifying', token)
        fetch(`http://localhost:3001/api/verify?token=${token}`)
            .then(resp => resp.json())
            .then(resp => {
                req.session.user = resp
                res.redirect('/')
            })
    })
    app.get('/logout', (req, res) => {
        req.session.user = undefined
        res.redirect('http://localhost:3001/logout')
    })

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})()