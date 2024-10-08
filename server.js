const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const db = require('./server/db/mongo');

//Constants
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const PRODUCTION = process.env.NODE_ENV === 'production';
const SALT = process.env.SALT;

app.use(express.static('static'));
app.use('/modules', express.static('node_modules'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

require('./server/auth/authRoutes')(app);
require('./server/user/userRoutes')(app);
require('./server/notifications/notificationRoutes')(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index/index.html');
});

//ENVIRONMENT VARIABLES CHECK
if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
}
if (!SALT) {
    throw new Error('SALT environment variable is not defined');
}

if (PRODUCTION) {
    https.createServer({
        key: fs.readFileSync('keys/key.pem'),
        cert: fs.readFileSync('keys/cert.pem')
    }, app).listen(PORT, () => {
        console.log(`Server is running in production mode at https://localhost:${PORT}`);
        db.connectToMongo(MONGO_URI);
    });
} else {
    app.listen(PORT, () => {
        console.log(`Server is running in development mode at http://localhost:${PORT}`);
        db.connectToMongo(MONGO_URI);
    });

}