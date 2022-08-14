const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDb'
    },
    products: Array
});
const cartModel = mongoose.model('cartDb',cartSchema);
module.exports = cartModel;