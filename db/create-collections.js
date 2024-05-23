//Update this to your MongoDB connection string and run it in the MongoDB shell using load() to create the collections.
//Do not remove the database name 'tinder' from the connection string.
db = connect('mongodb://username:password@0.0.0.0:27017/tinder');

const collections = ['users', 'sessions'];
const dbCollections = db.getCollectionNames();

print("Creating collections");

for(var i = 0; i < collections.length; i++) {
    print("Starting creating \"" + collections[i] + "\"");
    if(!dbCollections.includes(collections[i])) {
        db.createCollection(collections[i]);
        print("\"" + collections[i] + "\" created");
    } else {
        print("\"" + collections[i] + "\" already exists");
    }
}

print("Done");