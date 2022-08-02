const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const adminSchema = new Schema({
  
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true
    },
    
},{ collection:"admindbs"});

const adminModel = mongoose.model('adminDb',adminSchema);
module.exports = adminModel;