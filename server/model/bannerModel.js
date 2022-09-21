const mongoose = require('mongoose');
const bannerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    proId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'productDb',
    },
    image: String
},{collection:"bannerDb"});

const bannerModel = mongoose.model('bannerDb',bannerSchema);
module.exports = bannerModel;
