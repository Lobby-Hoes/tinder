const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const {MongoClient} = require('mongodb');
const fs = require('fs');
const {createHash} = require('crypto');

//Constants
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

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
    getCollection('users').insertOne(user);

    var session = createSession(user);

    res.cookie('session', session, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24), path: '/'});
    res.sendStatus(200);
});

app.post('/api/login', async (req, res) => {
    var user = req.body;
    user.password = createHash('sha256').update(user.username + user.password).digest('hex');

    var dbUser = await getCollection('users').findOne(user);
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
    var user = await checkSession(req.cookies.session);
    var profile = await getCollection('profiles').findOne({user: {$ne: user}});
    res.json(profile);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);

    if(!MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not defined');
    }
    client = new MongoClient(MONGO_URI);
    client.connect()
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error(err);
        });
});

function getCollection(name) {
    return client.db('tinder').collection(name);
}

function createSession(user) {

    const token = createHash('sha256').update(user.username + Date.now()).digest('hex')

    getCollection('sessions').insertOne({
        user: user.username,
        token: token,
        expires: Date.now() + 1000 * 60 * 60 * 24
    });

    return token;

}

async function checkSession(token) {
    var session = await getCollection('sessions').findOne({token: token});
    if (!session || session.expires < Date.now()) {
        return null;
    }

    return session.user;
}