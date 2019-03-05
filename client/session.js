const expressSession = require('express-session')
const MongoStore = require('connect-mongo')(expressSession)

export default function(app, db) {
    app.use(expressSession({
        secret: process.env.PG_SECRET || 'super_secret_123',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ db }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 * 4 // 28 days
        }
    }))
}



module.exports = 