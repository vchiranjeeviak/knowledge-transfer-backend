const { validationResult } = require('express-validator');
const User = require("../Models/User");

exports.getType = (req, res, next, type) => {
    req.type = type;
    next();
}

exports.getUserById = (req, res, next, id) => {
    User.findById(id, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: err
            })
        }
        user.encryptedPassword = undefined;
        req.profile = user;
        next();
    })
}

exports.getUser = (req, res) => {
    return res.status(200).json(req.profile);
}

exports.modifyUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.errors[0].msg
        });
    }
    User.findByIdAndUpdate(req.profile._id, req.body, { new: true }).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: "Couldnot update"
            })
        }
        return res.status(200).json({
            message: "User updated successfully",
            user: user
        })
    })
}

exports.deleteUser = (req, res) => {
    User.findByIdAndDelete(req.profile._id, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: "couldnot delete user"
            })
        }
        return res.status(200).json(user);
    })
}

exports.getCartItems = (req, res) => {
    User.findById(req.profile._id, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        return res.status(200).json({
            cartItems: user.cartItems
        })
    })
}

exports.modifyCartItems = (req, res) => {
    User.findById(req.profile._id, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Cant find"
            })
        }
        let cartItems = user.cartItems;
        if (req.type == '0') {
            if (cartItems) {
                cartItems.push(req.product._id);
            }
            else {
                cartItems = [];
                cartItems.push(req.product._id);
            }
        }
        else {
            cartItems = cartItems.filter(item => !item.equals(req.product._id));
        }
        User.findByIdAndUpdate(req.profile._id, { cartItems }, { new: true }).exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            return res.status(200).json({
                message: "Updated",
                cartItems: user.cartItems
            })
        })
    })

}