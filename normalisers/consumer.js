const { verify } = require('@femto-apps/verify')

module.exports = {
    name: name => {
        const result = verify('Name', name, [
            verify.string.minLength(3),
            verify.string.maxLength(255)
        ])

        if (result) {
            return [result]
        }

        return [null, name]
    },
    description: description => {
        const result = verify('Description', description, [
            verify.string.minLength(1),
            verify.string.maxLength(511)
        ])

        if (result) {
            return [result]
        }

        return [null, description]
    },
    redirects: redirects => {
        const exists = verify('Redirects', redirects, [
            verify.undefined.isNot()
        ])

        if (exists) {
            return [exists]
        }

        redirects = redirects.split(',')

        results = redirects.map((redirect, i) => verify(`Redirect[${i}]`, redirect, [
            verify.string.isURL()
        ]))

        if (results.some(result => result)) {
            return [results.flat()]
        }

        return [null, redirects]
    }
}