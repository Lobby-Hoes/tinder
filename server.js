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

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/static/register/register.html');
});

app.post('/api/register', (req, res) => {
    var user = req.body;

    user.password = createHash('sha256').update(user.username + user.password).digest('hex');

    //Insert additional fields
    user.creationDate = new Date();
    user.likedProfiles = [];
    user.dislikedProfiles = [];

    db.getCollection('users').insertOne(user);

    var session = createSession(user);

    res.cookie('session', session, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24), path: '/'});
    res.sendStatus(200);
});

app.post('/api/login', async (req, res) => {
    var user = req.body;
    user.password = createHash('sha256').update(user.username + user.password).digest('hex');

    var dbUser = await db.getCollection('users').findOne(user);
    if (!dbUser || dbUser.password !== user.password) {
        res.sendStatus(401);
        return;
    }

    var session = createSession(user);
    res.cookie('session', session, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24), path: '/'});
    res.sendStatus(200);
});

app.use(async function (req, res, next) {
    const user = req.cookies.session;
    const session = await checkSession(user);
    if (!user || !session) {
        res.clearCookie('session');
        res.redirect('/login');
        return;
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index/index.html');
});

app.get('/api/new-profile', async (req, res) => {
    var session = await checkSession(req.cookies.session);
    var user = await getProfile(session);

    const likedProfiles = user.likedProfiles;
    const dislikedProfiles = user.dislikedProfiles;
    const seenProfiles = likedProfiles.concat(dislikedProfiles);

    var profile = await db.getCollection('users').aggregate([{
        $match: {
            username: {
                $ne: user.username,
                $nin: seenProfiles
            }
        }
    }, {
        $sample: {size: 1}
    }]).toArray();

    res.send(profile[0]);
});

app.get('/api/user', async (req, res) => {
    var session = await checkSession(req.cookies.session);
    var user = getProfile(session);
    res.send(user);
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

function createSession(user) {

    const token = createHash('sha256').update(user.username + Date.now()).digest('hex')

    db.getCollection('sessions').insertOne({
        user: user.username,
        token: token,
        expires: Date.now() + 1000 * 60 * 60 * 24
    });

    return token;

}

async function checkSession(token) {
    var session = await db.getCollection('sessions').findOne({token: token});
    if (!session || session.expires < Date.now()) {
        return null;
    }

    return session.user;
}

async function getProfile(session) {
    return await db.getCollection('users').findOne({username: session});
}