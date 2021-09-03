require('dotenv').config();
const express = require('express'),
      userCtrl = require('./controllers/user'),
      postCtrl = require('./controllers/posts')
const massive = require('massive')
const session = require('express-session')
const app = express();

app.use(express.json());

const {CONNECTION_STRING, PORT_SERVER, SESSION_SECRET} = process.env;
massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectAuthorized: false}
}).then(dbInstance => {
    app.set('db', dbInstance);
}).catch(err => console.log(err))

app.use(session({
    resave: true,
    saveUninitialized: false,
    seceret: SESSION_SECRET,
    cookies = {
        maxAge : 1000 * 60 * 60 * 24 * 365,
    }
}))
//Auth Endpoints
app.post('/api/auth/register', userCtrl.register);
app.post('/api/auth/login', userCtrl.login);
app.get('/api/auth/me', userCtrl.getUser);
app.post('/api/auth/logout', userCtrl.logout);

//Post Endpoints
app.get('/api/posts', postCtrl.readPosts);
app.post('/api/post', postCtrl.createPost);
app.get('/api/post/:id', postCtrl.readPost);
app.delete('/api/post/:id', postCtrl.deletePost)

app.listen(PORT_SERVER, _ => console.log(`running on ${PORT_SERVER}`));