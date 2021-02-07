const webpush = require('web-push');
const NotificationSubscription = require('../DAO/notificationSubscriptionModel');
const { dbConnect, dbDisconnect} = require('../DAO/mongoDAO');

webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY);

exports.subscribeToPushNotification = async(req, res) => {
    const subscription = req.body;

    const payload = JSON.stringify({
        title: 'Notification Subscription',
        body: 'Subscription was successful!',
    });

    dbConnect();
    const newSubscription = new NotificationSubscription({...subscription.body})

    newSubscription.save(function (err, res) {
        if (err) {
            dbDisconnect();
            return console.error(err);
        }

        console.log(res);
    });

    webpush.sendNotification(subscription.body, payload)
        .then(result => console.log(result))
        .catch(e => console.log(e.stack))

    res.status(200).json({'success': true});
}