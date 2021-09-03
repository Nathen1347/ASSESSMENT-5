const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db');
        const result = await db.find_user_by_username([username]);
        const existingUser = result[0];
        if (existingUser) {
            return res.status(409).send('Username Exists');
        }
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        const createUser = await db.create_user([username, hash]);
        const user = createUser[0];
        req.session.user = {username: user.username, id: user.id};
        return res.status(201).send(req.session.user);
    },

    login: async (req,res) => {
        const {username, password} =req.body;
        const foundUser = await req.app.get('db').find_user_by_username([username]);
        const user = foundUser[0];
        if(!user){
            return res.status(401).send('User not found. Please register as new user');
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        if(!isAuthenticated){
            return res.status(403).send('Incorrect Password')
        }
        req.session.user = {username: user.username, id: user.id};
        return res.send(req.session.user);
    },

    logout: (req, res) => {
        req.session.destroy();
        return res.sendStatus(200);
    },

    getUser: (req, res) => {

    }
}