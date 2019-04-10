const Consumer = require('../models/Consumer')
const normUrl = require('normalize-url')

exports.getConsumer = async function(consumerId) {
	return Consumer.findOne({uuid: consumerId})
}

exports.getRedirects = function(consumer) {
	services = []
	for (let i = 0; i < consumer.redirects.length; i++) {
		services.push(normUrl(consumer.redirects[i]))
	}
	return services
}

exports.listConsumers = async function(req, res) {
	Consumer.find().then((consumers) => {
		res.locals.consumers = consumers
		res.render('listConsumers')
	}).catch((err) => {
		req.flash('error', 'The "consumers" collection could not be searched')
		res.redirect('/')
	})
}






