const mongoose = require('mongoose');
const saveAddressSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'userDb'
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    mobile:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    country: {
        type: String,
        required: true
    },
    address: {
        type : String,
        required: true
    },
    date:{
        type: Date,
        required:true
    },
},{collection:"saveAddressDb"});
const saveAddressModel = mongoose.model('saveAddressDb',saveAddressSchema);
module.exports = saveAddressModel;