const {MongoClient} = require('mongodb');
var client, db;
module.exports = {

    connectToMongo: async function (MONGO_URI) {
        client = await new MongoClient(MONGO_URI);
        db = await client.db('tinder');

        console.log("Connected to MongoDB");
    },

    getDatabase: function () {
        return db;
    },

    getCollection: function (collectionName) {
        return db.collection(collectionName);
    }
}