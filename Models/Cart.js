const mangoose = require('mongoose');
const Product = require('./Product');
const User = require('./User');

const CartSchema = new mangoose.Schema({
    user:{
        type:mongoose.SchemaTypes.userId,
        ref:"User"
    },
    cartItems: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product"
    }]
})
