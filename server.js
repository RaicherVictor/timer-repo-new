const express = require('express');

const app = express();

const passport = require('passport');

const VKontakteStrategy = require('passport-vkontakte').Strategy;

passport.use(new VKontakteStrategy({
    clientID: '51803759',
    clientSecret: 'd0b82532d0b82532d0b825321fd3ae535ddd0b8d0b82532b5de06a5d6001319b6a7685a',
    callbackURL: "https://oauth.vk.com/authorize"
},
    function (accessToken, refreshToken, params, profile, done) {
        return done(null, profile);
    }
));

const PORT = process.env.PORT || 5000

app.get('/auth/vkontakte',
    passport.authenticate('vkontakte'),
    function (req, res) {
        // The request will be redirected to vk.com for authentication, so
        // this function will not be called.
    });

app.get('/auth/vkontakte/callback',
    passport.authenticate('vkontakte', {
        failureRedirect: '/login',
        session: false
    }),
    function (req, res) {
        res.send(req.user);
    });

app.use(function (req, res, next) {
    const err = new Error('Ни хрена не найдено!');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    })
})

const server = app.listen(PORT, function () {
    console.log('Сервер пашет на порту: ' + server.address().port);
})