const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Product = require('./Product');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxlength: 40,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        maxlength: 40,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    encryptedPassword: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    addresses: [{
        type: String
    }],
    cartItems: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product"
    }],
    priviliges: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

userSchema.virtual('password').set(function (_password) {
    this.encryptedPassword = this.encryptPassword(_password);
})

userSchema.methods = {
    authenticate: function (plainPassword) {
        return bcrypt.compareSync(plainPassword, this.encryptedPassword);
    },
    encryptPassword: function (plainPassword) {
        const saltRounds = 10;
        const hash = bcrypt.hashSync(plainPassword, saltRounds);
        return hash;
    }
}

module.exports = mongoose.model("User", userSchema);