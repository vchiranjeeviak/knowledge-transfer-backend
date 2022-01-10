const Product = require("../Models/Product")
const { validationResult } = require('express-validator');
var fs = require('fs');
var path = require('path');
const User = require('../Models/User');

exports.getProductById = (req, res, next, id) => {
    Product.findById(id, (err, product) => {
        if (err || !product) {
            return res.status(400).json({
                error: err
            })
        }
        req.product = product;
        next();
    })
}

exports.getSearchTerm = (req, res, next, searchTerm) => {
    req.searchTerm = searchTerm;
    next();
}

exports.getProducts = (req, res) => {
    if (req.searchTerm === "0") {
        Product.find({}, (err, products) => {
            if (err || !products) {
                return res.status(400).json({
                    error: 'No products available'
                })
            }
            return res.status(200).json({
                products: products
            })
        })
    }
    else {
        Product.aggregate([
            {
                $search: {
                    "autocomplete": {
                        "path": "name",
                        "query": req.searchTerm
                    }
                }
            },
            {
                $project: {
                    "_id": 1,
                    "name": 1,
                    "description": 1,
                    "price": 1,
                    "images": 1,
                    "postedUser": 1
                }
            }
        ]).exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "No such products"
                })
            }
            return res.status(200).json({
                products: products
            })
        })
    }
}

exports.createProduct = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors
        })
    }
    req.body.postedUser = req.profile._id;
    let product = new Product({
        name: req.body.name, description: req.body.description, price: req.body.price, postedUser: req.body.postedUser, image: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            mimetype: req.file.mimetype
        }
    })
    product.save((err, product) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        return res.status(200).json(product)
    })
}
exports.getProduct = (req, res) => {
    Product.findById(req.product._id, (err, product) => {
        if (err) {
            return res.status(400).json({
                error: "product not found"
            })
        }
        return res.status(200).json(product);
    })

}

exports.modifyProduct = (req, res) => {
    Product.findByIdAndUpdate(req.product._id, req.body, { new: true }).exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error: "Couldnot update"
            })
        }
        return res.status(200).json({
            message: "Product updated successfully",
            product: product
        })
    })

}

exports.deleteProduct = (req, res) => {
    Product.findByIdAndDelete(req.product._id, (err, product) => {
        if (err) {
            return res.status(400).json({
                error: "product not found"
            })
        }
        User.find({}, (err, users) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            for (let index = 0; index < users.length; index++) {
                User.findByIdAndUpdate(users[index]._id, { cartItems: users[index].cartItems.filter(item => !item._id.equals(product._id)) }, { new: true }, (err, user) => {
                    if (err) {
                        return res.status(400).json({
                            error: err
                        })
                    }
                })
            }
        })
        return res.status(200).json(product);
    })
}

exports.getAllProductsOfUser = (req, res) => {
    Product.find({ postedUser: req.profile._id.toString() }, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        return res.status(200).json(products);
    })
}

exports.getImage = (req, res) => {
    Product.findById(req.product._id, (err, product) => {
        if (err) {
            return res.json(400).json({
                error: err
            })
        }
        return res.send(product.image.data);
    })
}