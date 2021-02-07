const ClientNews = require('../DAO/clientNewsModel');
const { dbConnect, dbDisconnect} = require('../DAO/mongoDAO')

exports.getClientsNewsEndpoint = async(req, res) => {
    dbConnect();

    ClientNews.find(function (err, clientNews) {
        if (err) {
            res.json({
                statusCode: 404,
                number_of_clients: clientNews.length,
                results: clientNews
            });
            dbDisconnect();
            return console.error(err);
        } 
        console.log(clientNews);
        res.json({
            statusCode: 200,
            number_of_clients: clientNews.length,
            results: clientNews.map(clientNews => clientNews.toObject())
        });

        dbDisconnect();
    });
}

exports.getClientNewsEndpointById = async(req, res) => {
    dbConnect();

    ClientNews.find({clientId: req.query.id}, function (err, clientNews) {
        if (err) {
            dbDisconnect();
            return console.error(err);
        }
        console.log(clientNews);
        res.json({
            status: 200,
            result: clientNews.map(clientNews => clientNews.toObject())
        });

        dbDisconnect();
    });
    
}

exports.saveClientNewsEndpoint = async(req, res) => {
    dbConnect();

    const newClientNews = new ClientNews({...req.body})

    ClientNews.find({clientId: newClientNews.clientId}, function (err, clientNews) {
        if (err) return console.error(err);

        console.log(clientNews);

        if(clientNews.length == 0) {
            newClientNews.save(function (err, newClientNews) {
                if (err) {
                    dbDisconnect();
                    return console.error(err);
                }
        
                res.json({
                    statusCode: 201,
                    message: "News for Client: " + newClientNews.name + "has been successfully created"
                })
            });
        } else {
            let newClientNewsObj = newClientNews.toObject();

            ClientNews.updateOne({clientId: newClientNews.clientId}, newClientNewsObj, function (err, status) {
                if (err) {
                    dbDisconnect();
                    return console.error(err);
                }
                
                res.json({
                    statusCode: 204,
                    message: "News for Client: " + newClientNewsObj.name + " has been successfully modified"
                })
            });
        }

        dbDisconnect();
    });
}
