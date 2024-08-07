const {createHash} = require("crypto");
const db = require("../db/mongo");
module.exports = {
    getSalt() {
        return process.env.SALT;
    },
    createSession(user) {
        const token = createHash('sha256').update(user.username + Date.now() + process.env.SALT).digest('hex')

        db.getCollection('sessions').insertOne({
            user: user._id,
            token: token,
            expires: Date.now() + 1000 * 60 * 60 * 24
        });

        return token;
    },

    async checkSession(token) {
        var session = await db.getCollection('sessions').findOne({token: token});
        if (!session || session.expires < Date.now()) {
            return null;
        }

        return session.user;
    },

    async getProfile(session) {
        return await db.getCollection('users').findOne({_id: session});
    }
}