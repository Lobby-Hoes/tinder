const db = require('../db/mongo');
const {checkSession, getProfile, getSalt} = require('../auth/authUtils');
const {createHash} = require("crypto");
const path = require("path");
const {ObjectId} = require("mongodb");
const __static = path.join(__dirname, '..', '..', 'static');
const multer = require('multer');
const fs = require('fs');

//Create Image Storage
fs.mkdir(__static + '/uploads/profile-images/', {recursive: true}, (err) => {
    if (err) throw err;
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __static + '/uploads/profile-images/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.mimetype.replace('image/', '.')) //Appending extension
    }
});

const upload = multer({storage: storage});


module.exports = function (app) {
    app.get('/api/new-profile', async (req, res) => {
        var session = await checkSession(req.cookies.session);
        var user = await getProfile(session);

        //Build Filter by sex and sexuality
        const preferences = user.preferences;
        var orCondition = [];

        for (let i in preferences) {
            const preference = preferences[i];
            const gender = preference.sex;
            const sexualities = preference.sexualities;
            orCondition.push({
                sex: gender,
                sexuality: {$in: sexualities}
            });
        }

        //Only show profiles that the user has not seen
        const likedProfiles = user.likedProfiles;
        const dislikedProfiles = user.dislikedProfiles;
        const seenProfiles = likedProfiles.concat(dislikedProfiles);
        seenProfiles.push(user.username);

        var profile = await db.getCollection('users').aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: user.location.coordinates
                    },
                    distanceField: 'dist.calculated',
                    maxDistance: user.distance,
                    spherical: true,
                    query: {
                        username: {$nin: seenProfiles},
                        $or: orCondition
                    }
                }
            },
            {
                $sample: {size: Number(req.query.size) || 1}
            }
        ]).toArray();

        res.send(profile);
    });

    app.get('/api/profile', async (req, res) => {
        var session = await checkSession(req.cookies.session);
        var user = await getProfile(session);

        let id = req.query.id !== "undefined" ? req.query.id : user._id;
        if (req.query.relative === 'true') {
            db.getCollection('users').aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: user.location.coordinates
                        },
                        distanceField: 'dist.calculated',
                        spherical: true,
                        query: {
                            _id: new ObjectId(id)
                        }
                    }
                },
                {
                    $sample: {size: 1}
                },
                {
                    $project: {
                        password: 0,
                        likedProfiles: 0,
                        dislikedProfiles: 0,
                        preferences: 0,
                        distance: 0
                    }
                }
            ]).toArray().then((data) => res.send(data[0]));
        } else {
            db.getCollection('users').findOne({_id: new ObjectId(id)}, {
                projection: {
                    password: 0,
                    likedProfiles: 0,
                    dislikedProfiles: 0,
                    preferences: 0,
                    distance: 0
                }
            }).then((data) => {
                res.send(data);
            });
        }
    });

    app.get('/api/matches', async (req, res) => {
        var session = await checkSession(req.cookies.session);
        var user = await getProfile(session);

        db.getCollection('matches').find({
            users: user.username
        }).toArray().then(async (data) => {
            var matchedUsers = [];
            for (let i in data) {
                var match = data[i];
                var matchedUser = match.users.filter((username) => username !== user.username)[0];

                var matchedUserData = await db.getCollection('users').findOne({username: matchedUser}, {
                    projection: {
                        password: 0,
                        likedProfiles: 0,
                        dislikedProfiles: 0,
                        preferences: 0
                    }
                });
                matchedUsers.push(matchedUserData);
            }

            res.send(matchedUsers);
        });
    });

    app.get('/api/user', async (req, res) => {
        var session = await checkSession(req.cookies.session);
        var user = await getProfile(session);
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
        });

        //Check for matches
        db.getCollection('users').findOne({
            username: likedUser,
            likedProfiles: user.username
        }).then((data) => {
            res.send(data !== null);
            if (data) {
                db.getCollection('matches').insertOne({
                    users: [user.username, likedUser],
                    date: new Date(),
                    seen: []
                });
            }
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

    app.post('/api/user/update', async (req, res) => {
        var session = await checkSession(req.cookies.session);
        var user = await getProfile(session);

        var updates = req.body;

        db.getCollection('users').updateOne({_id: user._id}, {
            $set: updates
        }).then(() => {
            res.sendStatus(200);
        });
    });

    app.post('/api/user/password', async (req, res) => {
        var session = await checkSession(req.cookies.session);
        var user = await getProfile(session);

        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;

        const currentPassword = user.password;
        const hashedOldPassword = createHash('sha256').update(getSalt() + oldPassword).digest('hex');

        if (currentPassword === hashedOldPassword) {
            const hashedNewPassword = createHash('sha256').update(getSalt() + newPassword).digest('hex');
            db.getCollection('users').updateOne({_id: user._id}, {
                $set: {
                    password: hashedNewPassword
                }
            }).then(() => {
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(403);
        }


    });

    app.post('/api/user/profile-image', upload.array('image'), async (req, res) => {
        var session = await checkSession(req.cookies.session);
        var user = await getProfile(session);

        const files = req.files;

        res.sendStatus(200);
    });

    app.get('/api/user/profile-images', async (req, res) => {
        var session = await checkSession(req.cookies.session);
        var user = await getProfile(session);

        res.send(user.images);
    });

    //Profile routes
    app.get('/profile', (req, res) => {
        res.sendFile(__static + '/profile/profile.html');
    });
}