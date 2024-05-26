const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;

!username ? print('MONGO_USERNAME not set') : null
!password ? print('MONGO_PASSWORD not set') : null
!host ? print('MONGO_HOST not set') : null
!port ? print('MONGO_PORT not set') : null

db = connect(`mongodb://${username}:${password}@${host}:${port}/tinder`);

const collections = ['users', 'sessions'];
const dbCollections = db.getCollectionNames();

print("Creating collections");

for (var i = 0; i < collections.length; i++) {
    print("Starting creating \"" + collections[i] + "\"");
    if (!dbCollections.includes(collections[i])) {
        db.createCollection(collections[i]);
        print("\"" + collections[i] + "\" created");
    } else {
        print("\"" + collections[i] + "\" already exists");
    }
}

print("Done");