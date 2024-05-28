const db = require('../db/mongo');
const {checkSession, getProfile} = require('../auth/authUtils');

module.exports = function (app) {
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
            $sample: {size: Number(req.query.size) || 1}
        }]).toArray();

        res.send(profile);
    });

    app.get('/api/user', async (req, res) => {
        var session = await checkSession(req.cookies.session);
        var user = getProfile(session);
        res.send(user);
    });

    app.post('/api/like', async (req, res) => {
        var likedUser = req.query.user;

        if (!likedUser) {
            res.sendStatus(400);
            return;
        }

        var session = await checkSession(req.cookies.session);
        var user = await getProfile(session);

        db.getCollection('users').updateOne({username: user.username}, {
            $push: {
                likedProfiles: likedUser
            }
        }).then(() => {
            res.sendStatus(200);
        });
    });

    app.post('/api/dislike', async (req, res) => {
        var dislikedUser = req.query.user;

        if (!dislikedUser) {
            res.sendStatus(400);
            return;
        }

        var session = await checkSession(req.cookies.session);
        var user = await getProfile(session);

        db.getCollection('users').updateOne({username: user.username}, {
            $push: {
                dislikedProfiles: dislikedUser
            }
        }).then(() => {
            res.sendStatus(200);
        });
    });
}