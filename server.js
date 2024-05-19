const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');
const fs = require('fs');

var client;

const port = 4000;

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/static/login/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/static/register/register.html');
});

app.post('/api/register', (req, res) => {
    var user = req.body;
    getCollection('users').insertOne(user);
});

app.use(function (req, res, next) {
    const user = req.cookies.session;
    if(!user) {
        res.redirect('/login');
        return;
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index/index.html');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);

    var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

    client = new MongoClient(config.mongoUri);
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