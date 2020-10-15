require('./config/config');
require('./db/mongoose');

const path = require('path');
const http = require('http');
const fs = require('fs');
const express = require('express');
const _ = require('lodash');
const {analyzeProject} = require('./modules/analyzer');
let moment = require('moment');

if ('default' in moment) {
    moment = moment.default;
}

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const users = new Users();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(publicPath));

/* ************************************************************* */
/* Add Headers for developpment mode                             */
/* ************************************************************* */

if (!process.env.NODE_ENV && port !== 3000) {
    app.use((req, res, next) => {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', '*');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
}

require('./socket')(server);


/** ************************************************************* */
/* Authentication                                                 */
/** ************************************************************* */

/* Create Account */

app.post('/api/users', async (req, res) => {
    const user = new User(_.pick(req.body, ['email', 'password', 'username']));
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token)
            .send(user);
    } catch (error) {
        res.status(400)
            .send(error);
    }
});

/* Log in */

app.post('/api/users/login', async (req, res) => {
    const body = _.pick(req.body, ['username', 'password']);

    try {
        console.log('trying to login', body.username);
        const user = await User.findByCredentials(body.username, body.password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token)
            .send({
                _id: user._id,
                email: user.email,
                username: user.username,
                token
            });
    } catch (error) {
        res.status(400)
            .send(error);
    }
});

app.get('/api/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

/* Remove token on log out */

app.delete('/api/users/me/token', authenticate, async (req, res) => {
    try {
        await req.user.removeToken(req.token);
        res.status(200)
            .send();
    } catch (error) {
        res.status(400)
            .send(error);
    }
});

/* ************************************************************** */
/* Serving App with Client-side routing                           */
/* ************************************************************** */

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

server.listen(port, () => {
    console.log(`Started server at port ${port}`);
});

module.exports = {app};
