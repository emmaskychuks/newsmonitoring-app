const mongoose = require('mongoose')

const keys = {
    p256dh: String,
    auth: String,
}

const notificationSubscriptionSchema = new mongoose.Schema({
    id: false,
    endpoint: String,
    expirationTime: String,
    keys: keys
}, {
    autoCreate: true
})

notificationSubscriptionSchema.set('toObject', {
    transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.id
    }
})

const NotificationSubscription = mongoose.model('notificationSubscription', notificationSubscriptionSchema);

module.exports = NotificationSubscription;