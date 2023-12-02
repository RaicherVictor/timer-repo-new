const express = require('express');

const app = express();

const passport = require('passport');

const VKontakteStrategy = require('passport-vkontakte').Strategy;

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, function () {
    console.log('Сервер пашет на порту: ' + server.address().port);
})

// User session support middlewares. Your exact suite might vary depending on your app's needs.
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
    require("express-session")({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new VKontakteStrategy(
        {
            clientID:'51803759', 
            clientSecret: 'd0b82532d0b82532d0b825321fd3ae535ddd0b8d0b82532b5de06a5d6001319b6a7685a' ,
            callbackURL: "https://pepelac.ddns.net/",
        },
        function myVerifyCallbackFn(
            accessToken,
            refreshToken,
            params,
            profile,
            done
        ) {
            // Now that we have user's `profile` as seen by VK, we can
            // use it to find corresponding database records on our side.
            // Also we have user's `params` that contains email address (if set in
            // scope), token lifetime, etc.
            // Here, we have a hypothetical `User` class which does what it says.
            User.findOrCreate({ vkontakteId: profile.id })
                .then(function (user) {
                    done(null, user);
                })
                .catch(done);
        }
    )
);

// User session support for our hypothetical `user` objects.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then(function (user) {
            done(null, user);
        })
        .catch(done);
});

app.get("/auth/vkontakte", passport.authenticate("vkontakte"));

app.get(
    "/auth/vkontakte/callback",
    passport.authenticate("vkontakte", {
        successRedirect: "/",
        failureRedirect: "/login",
    })
);

app.get("/", function (req, res) {
    //Here you have an access to req.user
    res.json(req.user);
});