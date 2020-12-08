module.exports = {
  port: 3001,
  mongo: {
    uri: 'mongodb://localhost:27017/',
    db: 'authenticationProvider'
  },
  redis: {
    // url: 'redis://192.168.207.201:6379/7',
    host: '192.168.207.201',
    port: 6379,
    db: 7,
    session: 'sessions'
  },
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 * 4, // 28 days
    secret: 'CHANGE_ME',
    name: 'provider'
  },
  session: {
    secret: 'CHANGE_ME'
  },
  title: {
    suffix: 'Femto Authentication Provider'
  },
  favicon: 'public/images/favicon/favicon.ico',
}
