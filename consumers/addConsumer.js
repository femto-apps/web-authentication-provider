const Consumer = require('../models/Consumer')

exports.add = function(req, res, next) {
	Consumer.findOne({name: req.body.name}).then((existingConsumer) => {
		if (existingConsumer) {
			req.flash('error', 'Consumer name already in use.')
            return res.redirect(req.originalUrl)
		}

		let consumer = new Consumer({
			name: req.body.name,
			description: req.body.description, 
			redirects: req.body.redirects.split(',')
		})

		consumer.save().then(() => {
			req.flash('success', 'Consumer made successfully')
			return res.redirect('/')
		}).catch((err) => {
			req.flash('error', 'Consumer could not be saved')
			return res.redirect('/')
		})
	}).catch((err) => {
		req.flash('error', 'Consumer collection could not be searched')
		return res.redirect('/')
	})
}

