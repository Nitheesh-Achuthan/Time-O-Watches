const mongoose = require('mongoose');

const usedSchema =new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userDb'
    },
    coupon:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
});

const couponUsedModel = mongoose.model('couponUsedDb',usedSchema);

module.exports = couponUsedModel;