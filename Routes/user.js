const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { isSignedIn, isAuthenticated } = require('../Controllers/auth');
const { getUserById, getUser, getType, deleteUser, modifyUser, getCartItems, modifyCartItems, addAddress } = require('../Controllers/user');
const { getProductById } = require('../Controllers/product')

router.param('userId', getUserById);
router.param('productId', getProductById);
router.param('type', getType);

router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);
router.put('/user/:userId', [
    check('firstName').isLength({ min: 1, max: 40 }).withMessage('First Name should be > 0 and <= 40 characters'),
    check('lastName').isLength({ min: 1, max: 40 }).withMessage('Last Name should be > 0 and <= 40 characters'),
    check('phoneNumber').isLength({ min: 10, max: 10 }).withMessage('Enter a valid phone number')
], isSignedIn, isAuthenticated, modifyUser);
router.get('/user/cart/:userId', isSignedIn, isAuthenticated, getCartItems);
router.put('/user/address/:userId', isSignedIn, isAuthenticated, addAddress);
router.put('/user/:userId', isSignedIn, isAuthenticated, modifyUser);
router.put('/user/:userId/:productId/:type', isSignedIn, isAuthenticated, modifyCartItems);
router.delete('/user/:userId', isSignedIn, isAuthenticated, deleteUser);

module.exports = router;