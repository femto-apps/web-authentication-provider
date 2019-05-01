const uuidv4 = require('uuid/v4')
const Errors = require('@femto-apps/errors')('../errors.json')

const Consumer = require('../models/Consumer')

async function createConsumer(name, description, redirects, authorisation) {
    const consumerId = uuidv4()

    if (typeof authorisation === 'undefined') authorisation = {}
    if (typeof authorisation.secret === 'undefined') authorisation.secret = uuidv4()

    const consumer = new Consumer({
        uuid: consumerId,
        name, description, redirects, authorisation
    })

    await consumer
        .save()
        .catch(err => {
            throw Errors('ERR_CONSUMER_SAVE', { consumerId, err })
        })

    return {
        consumer
    }
}

async function readConsumer(consumerId) {
    const consumer = await Consumer.findOne({ uuid: consumerId })
        .catch(err => {
            throw Errors('ERR_CONSUMER_FIND', { consumerId, err })
        })

    return consumer
}

async function readConsumerBySecret(path, secret) {
    const consumer = await Consumer.findOne({ [path]: secret })
        .catch(err => {
            throw Errors('ERR_CONSUMER_SECRET_FIND', { path, secret, err })
        })

    return consumer
}

function readConsumers() {
    return Consumer.find({})
}

function updateConsumer(consumerId, name, description, redirects, { /* authorisation */ }) {
    return Consumer.updateOne({
        uuid: consumerId
    }, {
        $set: { name, description, redirects }
    })
}

function deleteConsumer(consumerId) {
    return Consumer.remove({ uuid: consumerId })
}

module.exports = {
    createConsumer,
    readConsumer,
    readConsumerBySecret,
    readConsumers,
    updateConsumer,
    deleteConsumer
}
