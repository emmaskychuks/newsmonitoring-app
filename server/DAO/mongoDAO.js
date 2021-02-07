const mongoose = require('mongoose')
require('dotenv').config();
let db;

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}, {useUnifiedTopology: true})

    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    // we're connected!
    console.log("Database Connected!")
    });
}

const dbDisconnect = () => {
    db.close();
    console.log("Database has been disconnected!")
}

module.exports = {dbConnect, dbDisconnect}