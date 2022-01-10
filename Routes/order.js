const express = require('express');
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require('../Controllers/auth');
const { getUserById } = require('../Controllers/user');
const { getOrderById, placeOrder, getOrder, cancelOrder, deliverOrder } = require('../Controllers/order');

router.param('userId', getUserById);
router.param('orderId', getOrderById);

router.post('/order/:userId', isSignedIn, isAuthenticated, placeOrder);
router.get('/order/:orderId/:userId', isSignedIn, isAuthenticated, getOrder);
router.put('/order/:orderId/:userId', isSignedIn, isAuthenticated, cancelOrder);
router.put('/order/:orderId', isSignedIn, isAdmin, deliverOrder);

module.exports = router;