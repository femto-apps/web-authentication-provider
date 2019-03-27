const Consumers = require('../models/Consumer')

module.exports = {
    '100': {
        redirects: [
            'http://localhost:3002'
        ]
    }
}

getConsumer = async function(consumerId) {
	return consumer = await Consumer.findOne({_id: id})
}
