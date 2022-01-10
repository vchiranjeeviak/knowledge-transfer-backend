const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { signup, signin, signout, isSignedIn } = require('../Controllers/auth');

router.post('/signup', [
    check('firstName').isLength({ min: 1, max: 40 }).withMessage('First Name should be > 0 and <= 40 characters'),
    check('lastName').isLength({ min: 1, max: 40 }).withMessage('Last Name should be > 0 and <= 40 characters'),
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').isLength({ min: 8 }).withMessage("Invalid Password"),
    check('phoneNumber').isLength({ min: 10, max: 10 }).withMessage('Enter a valid phone number')
], signup);

router.post('/signin', [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').isLength({ min: 8 }).withMessage("Invalid Password")
], signin);

router.get('/signout', isSignedIn, signout);

module.exports = router;