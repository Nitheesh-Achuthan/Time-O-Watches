const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type : String,
        required : true
    }, 
    lastName: {
        type : String,
        required : true
    }, 
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true    
    },
    isBlocked: { type: Boolean, default: false }
});

const model = mongoose.model('userDb',userSchema);
module.exports = model;
