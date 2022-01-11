const { validationResult } = require('express-validator');
const User = require('../Models/User');
const jwt = require("jsonwebtoken");
const ejwt = require("express-jwt");
const mongoose = require('mongoose');

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg
        });
    }
    let user = new User(req.body);

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        user.encryptedPassword = undefined;
        return res.status(200).json(user);
    })
}

exports.signin = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg
        });
    }
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "User not found" })
        }
        if (!user.authenticate(req.body.password)) {
            return res.status(400).json({ error: "Password Incorrect" })
        }
        const token = jwt.sign({
            id: user._id
        }, process.env.SECRET)

        res.cookie("token", token)
        user.encryptedPassword = undefined;
        return res.status(200).json({
            token: token,
            user: user
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        message: "User Signed Out"
    })
}

exports.isSignedIn = ejwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    userProperty: "auth"
})

exports.isAuthenticated = (req, res, next) => {
    if (!(req.profile && req.auth && req.profile._id.equals(mongoose.Types.ObjectId(req.auth.id)))) {
        return res.status(400).json({
            message: "You are not authenticated"
        })
    }
    next();
}