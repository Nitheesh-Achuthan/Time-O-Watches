const mongoose = require('mongoose');

const productschema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }, 
    price:{
        type: Number,
        required: true
       
    },
    quantity:{
        type:Number,
        required:true
    },
    category:{
        type: String,
        required:true
    },
    // description:{
    //     type: String,
    //     required: true
    // },
    image: String
       
    
},{ collection:"productDb"});

const productModel = mongoose.model('productDb',productschema);

module.exports = productModel;