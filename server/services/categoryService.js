let userDb = require('../model/model');
let adminDb = require('../model/adminModel');
let categoryDb = require('../model/categoryModel');
let productDb = require('../model/productModel');
let controller = require('../controller/controller');




exports.addCate = (name)=>{
    // console.log('Im serviceeeeeeee',name);

    const cat = new categoryDb({
       name:name
    })
    cat.save()
    
};  

exports.updateCate = async (id,newName) => {
    const udt = await categoryDb.updateOne({_id:id},{$set:{name:newName} })
}

exports.deleteCate = async (id)=>{
    const dlt= await categoryDb.findByIdAndDelete(id)
    // console.log(dlt,'Deletinggg');
    // return;
} 