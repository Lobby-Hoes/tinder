const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const {MongoClient} = require('mongodb');
const fs = require('fs');
const https = require('https');
const {createHash} = require('crypto');
const db = require('./server/db/mongo');

//Constants
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const PRODUCTION = process.env.NODE_ENV === 'production';

let client;

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

require('./server/auth/authRoutes')(app);
require('./server/user/userRoutes')(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index/index.html');
});

if (PRODUCTION) {
    https.createServer({
        key: fs.readFileSync('keys/key.pem'),
        cert: fs.readFileSync('keys/cert.pem')
    }, app).listen(PORT, () => {
        console.log(`Server is running in production mode at https://localhost:${PORT}`);

        if (!MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
        db.connectToMongo(MONGO_URI);
    });
} else {
    app.listen(PORT, () => {
        console.log(`Server is running in development mode at http://localhost:${PORT}`);

        if (!MONGO_URI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
        db.connectToMongo(MONGO_URI);
    });

}