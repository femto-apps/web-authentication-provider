const { verify } = require('@femto-apps/verify')
const { normalise } = require('@femto-apps/normaliser')
const Errors = require('@femto-apps/errors')('../errors.json')

const consumerService = require('../services/consumer')
const consumerNormaliser = require('../normalisers/consumer')

async function getConsumer(req, res) {
    const consumerId = req.params.consumerId
    const consumer = await consumerService.readConsumer(consumerId)

    if (!consumer) {
        return res.status(404).json({ error: Errors('ERR_CONSUMER_FIND', { consumerId }) })
    }

    return res.json(consumer)
}

async function getConsumers(req, res) {
    const consumers = await consumerService.readConsumers()

    return res.json({
        consumers
    })
}

async function postConsumer(req, res) {
    const { name, description, redirects, error } = await normalise(consumerNormaliser, req.body)

    // errors will only be populated if validation errors occurred
    if (error) {
        return res.status(400).json({ error })
    }

    consumerService.createConsumer(name, description, redirects, { /* authorisation */ })
        .then(({ consumerId }) => {
            return res.json({
                consumerId
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
}

async function putConsumer(req, res) {
    const { name, description, redirects, error } = await normalise(consumerNormaliser, req.body)

    // errors will only be populated if validation errors occurred
    if (error) {
        return res.status(400).json({ error })
    }
    
    consumerService.updateConsumer(req.params.consumerId, name, description, redirects, { /* authorisation */ })
        .then(() => {
            return res.json({
                message: 'Success'
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err
            })
        })
}

async function deleteConsumer(req, res) {

}

module.exports = {
    getConsumer,
    getConsumers,
    postConsumer,
    putConsumer,
    deleteConsumer
}