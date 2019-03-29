const Consumer = require('../models/Consumer')
const normUrl = require('normalize-url')

exports.getConsumer = async function(consumerId) {
	return Consumer.findOne({_id: consumerId})
}

exports.getRedirects = function(consumer) {
	services = []
	for (let i = 0; i < consumer.redirects.length; i++) {
		services.push(normUrl(consumer.redirects[i]))
	}
	return services
}


/*
module.exports = {
    '100': {
        redirects: [
            'http://localhost:3002'
        ]
    }
}
*/



