const mongoose = require ('mongoose');

const couponSchema = new mongoose.Schema({
    code:{
        type: 'String',
        required:true
    },
    percentage:{
        type:Number,
        required:true
    },    
    fromDate:{
        type:Date,
        required: true
    },
    toDate:{
        type:Date,
        required:true
    },
    status:{
        type: Boolean,
        default: true
    },
    min:{
        type:Number,
        required:true
    }
});
const couponModel = mongoose.model('couponDb',couponSchema)
module.exports = couponModel;