const {createHash} = require("crypto");
const db = require("../db/mongo");
const {createSession, checkSession, getSalt} = require("./authUtils");
const path = require("path");
const {newObjectID} = require("../db/mongo");
const __static = path.join(__dirname, '..', '..', 'static');

module.exports = function (app) {
    app.get('/login', (req, res) => {
        res.sendFile(__static + '/login/login.html');
    });

    app.get('/register', (req, res) => {
        res.sendFile(__static + '/register/register.html');
    });

    app.post('/api/register', (req, res) => {
        var user = req.body;

        user.password = createHash('sha256').update(getSalt() + user.password).digest('hex');

        //Insert additional fields
        user.creationDate = new Date();
        user.birthday = new Date(user.birthday);
        user.distance = 100000;
        user.likedProfiles = [];
        user.dislikedProfiles = [];
        user._id = newObjectID();

        db.getCollection('users').insertOne(user);

        var session = createSession(user);

        res.cookie('session', session, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24), path: '/'});
        res.sendStatus(200);
    });

    app.post('/api/login', async (req, res) => {
        var user = req.body;
        user.password = createHash('sha256').update(getSalt() + user.password).digest('hex');

        var dbUser = await db.getCollection('users').findOne(user);
        if (!dbUser || dbUser.password !== user.password) {
            res.sendStatus(401);
            return;
        }

        var session = createSession(dbUser);
        res.cookie('session', session, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24), path: '/'});
        res.sendStatus(200);
    });

    app.use(async function (req, res, next) {
        const user = req.cookies.session;
        const session = await checkSession(user);
        if (!user || !session) {
            res.clearCookie('session');
            res.status(401);
            res.redirect('/login');
            return;
        }
        next();
    });
}