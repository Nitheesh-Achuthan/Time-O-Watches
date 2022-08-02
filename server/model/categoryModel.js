const mongoose = require('mongoose');


const categoryschema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }       
    
},{ collection:"categoryDb"});

const categoryModel = mongoose.model('categoryDb',categoryschema);

module.exports = categoryModel;
