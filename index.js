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
const config = require('@femto-apps/config')

const foreign = require('./modules/foreign')
const login = require('./modules/login')

;(async () => {
    const app = express()
    const port = config.get('port')

    const db = (await MongoClient.connect(config.get('mongoUri'), { useNewUrlParser: true })).db(config.get('dbName'))
    mongoose.connect(config.get('mongoUri') + config.get('dbName'), { useNewUrlParser: true })

    app.set('view engine', 'pug')

    app.use(express.static('public'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cookieParser(config.get('cookie.secret') || 'super_secret_123'))
    app.use(expressSession({
        secret: config.get('session.secret') || 'super_secret_123',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ db }),
        cookie: {
            maxAge: config.get('cookie.maxAge')
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
