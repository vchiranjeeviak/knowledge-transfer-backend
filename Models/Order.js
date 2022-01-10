const mongoose = require('mongoose');

//TODO: Need to update with required true later
const orderSchema = mongoose.Schema({
    products: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product"
    }],
    transaction_id: {
        type: String
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    address: {
        type: String
    },
    status: {
        type: String,
        enum: ['Processing', 'Delivered', 'Cancelled'],
        default: 'Processing'
    }
})

module.exports = mongoose.model("Order", orderSchema);