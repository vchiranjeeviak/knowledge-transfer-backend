const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { getUserById } = require("../Controllers/user");
const { getImage, createProduct, getProductById, getProduct, getSearchTerm, getProducts, getAllProductsOfUser, modifyProduct, deleteProduct } = require("../Controllers/product")
const { isSignedIn, isAuthenticated } = require("../Controllers/auth");
const { Router } = require('express');

var multer = require('multer');

var storage = multer.memoryStorage()
var upload = multer({
   storage: storage,
   fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
         cb(null, true);
      } else {
         cb(null, false);
         return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
   }
});

router.param("userId", getUserById)
router.param("productId", getProductById)
router.param("searchTerm", getSearchTerm);

router.get('/product/image/:productId', getImage)

router.post('/product/:userId', isSignedIn, isAuthenticated, upload.single('image'), [
   check('name').isLength({ min: 1, max: 50 }).withMessage('Enter valid productName'),
   check('description').isLength({ min: 1, max: 2000 }).withMessage('description is requried'),
   check('price').not().isEmpty().withMessage('enter the price')
], createProduct)
router.get('/product/:productId/', getProduct)
router.get('/product/postedUser/:userId', isSignedIn, isAuthenticated, getAllProductsOfUser)
router.get('/product/search/:searchTerm', getProducts)
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, modifyProduct)
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, deleteProduct)

module.exports = router;