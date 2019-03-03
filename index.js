const expressSession = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')(expressSession)
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const flash = require('express-flash')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const reload = require('reload')
const path = require('path')

const foreign = require('./modules/foreign')
const login = require('./modules/login')

;(async () => {
    const app = express()
    const port = 3001

    const db = (await MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })).db('simple_auth')
    mongoose.connect('mongodb://localhost:27017/simple_auth', { useNewUrlParser: true })

    app.set('view engine', 'pug')

    app.use(express.static('public'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cookieParser(process.env.PG_SECRET || 'super_secret_123'))
    app.use(expressSession({
        secret: process.env.PG_SECRET || 'super_secret_123',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ db }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 * 4 // 28 days
        }
    }))
    app.use(flash())

    login.init(app)

    app.use((req, res, next) => {
        res.locals.req = req
        res.locals.development = process.env.NODE_ENV === 'development'
        app.locals.pretty = process.env.NODE_ENV === 'development'
        res.locals.path = req.path
        next()
    })
    app.use(morgan('dev'))

    app.get('/', (req, res) => res.render('home'))
    app.get('/login', (req, res) => res.render('login'))
    app.get('/register', (req, res) => res.render('login'))
    app.get('/logout', login.getLogout)

    app.post('/login', login.postLogin)
    app.post('/register',  login.postRegister)

    app.get('/api/auth', login.isAuthenticated, foreign.getAuth)
    app.get('/api/verify', foreign.getVerify)

    reload(app)

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})()