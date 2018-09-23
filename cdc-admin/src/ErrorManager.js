import PubSub from 'pubsub-js'

export default class ErrorManager {
    publishErrors(err) {
        for (var i = 0; i < err.errors.length; i++) {
            var error = err.errors[i]
            PubSub.publish('validatorError', error)
        }
    }
}