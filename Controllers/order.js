const Order = require('../Models/Order');

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
        return res.status(200).json(order);
    })
}

exports.getOrder = (req, res) => {
    Order.findById(req.order._id, (err, order) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        return res.status(200).json(order);
    })
}

exports.cancelOrder = (req, res) => {
    Order.findByIdAndUpdate(req.order._id, { status: 'Cancelled' }, { new: true }).exec((err, order) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        return res.status(200).json(order);
    })
}

exports.deliverOrder = (req, res) => {
    Order.findByIdAndUpdate(req.order._id, { status: 'Delivered' }, { new: true }).exec((err, order) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        return res.status(200).json(order);
    })
}