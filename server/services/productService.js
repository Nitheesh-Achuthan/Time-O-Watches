let userDb = require('../model/model');
let adminDb = require('../model/adminModel');
let categoryDb = require('../model/categoryModel');
let productDb = require('../model/productModel');
let productController = require('../controller/productController');


exports.editProducts = async (id)=>{
    console.log(id,'productedittttttt');
    const edit = await productDb.findOne({_id:id}); 
    console.log(edit);
    return edit;
}

exports.updateProduct = async (proId,proDetails)=>{
    const update = await productDb.updateOne({_id:proId},{
        $set:{
            name:proDetails.name,
            price:proDetails.price,
            quantity:proDetails.quantity,
            category:proDetails.category 

        }})
        return update;
}

exports.deleteProduct = async (id)=>{ 
    const dlt= await productDb.findByIdAndDelete(id)
    // console.log(dlt,'Deletinggg');
    // return;
}