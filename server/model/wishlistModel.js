const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userDb'
    },
    products: Array
});

module.exports = mongoose.model('wishlistDb',wishlistSchema);

