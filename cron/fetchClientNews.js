const ClientNews = require('../server/DAO/clientNewsModel');
const { dbConnect, dbDisconnect} = require('../server/DAO/mongoDAO')
const axios = require('axios');
const { db } = require('../server/DAO/clientNewsModel');
const webpush = require('web-push');
const NotificationSubscription = require('../server/DAO/notificationSubscriptionModel');

const fetchAllNewsForAllClients = async () => {
    let clientsAndInterests = [];

    dbConnect();

    ClientNews.find(function (err, clientNews) {
        if (err) {
            dbDisconnect();
            return console.error(err);
        } 
        
        clientNews.forEach(client => {
            clientsAndInterests.push({clientId: client.clientId, clientName: client.name, interests: client.interests})
        })

        console.log("Getting updated news");

        queryClientNewsBasedOnInterests(clientsAndInterests)
        .then(data => {
            console.log(data);

            data.forEach(client => {
                let newClientNewsObj = clientNews.find(x => x.clientId == client.clientId);
                newClientNewsObj = newClientNewsObj.toObject();
                newClientNewsObj = {
                    ...newClientNewsObj,
                    clientNews: client.clientNews
                };
                //delete newClientNewsObj["_id"];
    
                ClientNews.updateOne({clientId: client.clientId}, newClientNewsObj, function (err, status) {
                    if (err) {
                        dbDisconnect();
                        return console.error(err);
                    }
                    
                   console.log("News for " + newClientNewsObj.name + " has been updated!");
                });

                // Send push notifications to subscribers
                const payload = JSON.stringify({
                    title: 'Client News Update',
                    body: `${client.clientName} has updated news ready to view.`,
                });

                NotificationSubscription.find(function(err, subscriptions) {  // Get all subscriptions
                    if (err) {
                        dbDisconnect();
                        return console.error(err);
                    }

                    subscriptions.forEach(subscription => { // Send push notifications to subscribers
                        webpush.sendNotification(subscription, payload)
                            .then(result => console.log(result))
                            .catch(e => console.log(e.stack))
                    });
                });
            });

        })
        .catch(error => {
            dbDisconnect();
            console.log(error);
        });

    });
}

const queryClientNewsBasedOnInterests = async (clientsMap) => {

    const backendHost = process.env.BACKEND_HOST || "backend";
    const backendPort = process.env.BACKEND_PORT || 3001; 

    let clientsAndUpdatedNews = [];
    let client;

    for(client of clientsMap) {
        await axios.get(`http://${backendHost}:${backendPort}/query`, {
            params: {
                tags: client.interests,
                limit: 20
            }
        })
        .then(response => {
            const data = response.data[0];

            let formattedNews = getFormatedClientNews(data.results);

            clientsAndUpdatedNews.push({clientId: client.clientId, clientName: client.clientName, clientNews: formattedNews});
        })
        .catch(error => {
            console.log(error);
        });
    };

    return clientsAndUpdatedNews;
}

const getFormatedClientNews = (clientNews) => {
    let formattedClientNews = [];

    clientNews.forEach(news => {
        let newsArticle = {
            newsHeadline: '',
            newsSummary: '',
            newsSource: '',
            relevanceScore: '',
            newsURL: '',
            imageURL: '',
            publishedDate: ''
        }

        newsArticle.newsHeadline = news.title;
        newsArticle.newsSummary = news.text;
        newsArticle.newsSource = news.host;
        newsArticle.newsURL = news.url;
        newsArticle.imageURL = news.main_image_url;
        newsArticle.relevanceScore = news.result_metadata.score;
        newsArticle.publishedDate = news.publication_date;

        formattedClientNews.push(newsArticle);
    });

    return formattedClientNews;
}

module.exports = fetchAllNewsForAllClients