const mongoose = require('mongoose');

//TODO: Need to update with required true later
const orderSchema = mongoose.Schema({
    products: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product"
    }],
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Order", orderSchema);