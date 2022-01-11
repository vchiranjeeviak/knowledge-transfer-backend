const express = require('express');
const router = express.Router();

const { isSignedIn, isAuthenticated } = require('../Controllers/auth');
const { getUserById } = require('../Controllers/user');
const { getOrderById, placeOrder, getOrders, cancelOrder } = require('../Controllers/order');

router.param('userId', getUserById);
router.param('orderId', getOrderById);

router.post('/order/:userId', isSignedIn, isAuthenticated, placeOrder);
router.get('/order/:userId', isSignedIn, isAuthenticated, getOrders);
router.delete('/order/:orderId/:userId', isSignedIn, isAuthenticated, cancelOrder);

module.exports = router;