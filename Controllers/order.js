const Order = require('../Models/Order');
const User = require('../Models/User');

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id, (err, order) => {
        if (err || !order) {
            return res.status(400).json({
                error: err
            })
        }
        req.order = order;
        next();
    })
}

exports.placeOrder = (req, res) => {
    let order = new Order(req.body);
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        User.findByIdAndUpdate(req.profile._id, { cartItems: [] }, { new: true }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
        })
        return res.status(200).json(order);
    })
}

exports.getOrders = (req, res) => {
    Order.find({ owner: req.profile._id }, (err, orders) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        return res.status(200).json(orders);
    })
}

exports.cancelOrder = (req, res) => {
    Order.findByIdAndDelete(req.order._id).exec((err, order) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        return res.status(200).json(order);
    })
}
