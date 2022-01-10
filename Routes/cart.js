const express = require('express');
const router = express.Router();

router.post('/cart/:userId', isSignedIn, isAuthenticated, placeOrder);
router.get('/cart/:userId', isSignedIn, isAuthenticated, getOrder);
router.put('/cart/:orderId/:userId', isSignedIn, isAuthenticated, cancelOrder);