let userDb = require('../model/model');
let adminDb = require('../model/adminModel');
let categoryDb = require('../model/categoryModel');
let productDb = require('../model/productModel');


exports.editProducts = async (id)=>{
    // console.log(id,'productedittttttt');
    const edit = await productDb.findOne({_id:id}); 
    // console.log(edit);
    return edit;
}

// -- for product offers --//
exports.products = async()=>{
    const product = productDb.find()
    return product;
}













exports.updateProduct = async (proId,proDetails)=>{
    let image = proDetails.image;
    if(image) {
        let uploadPath = `./public/images/${date}.jpeg`
        var imgPath = `images/${date}.jpeg`
        let date = Date.now();
        image.mv(uploadPath,(err)=>{})
           
    }
    const product = {
            name:proDetails.name,
            price:proDetails.price,
            quantity:proDetails.quantity,
            category:proDetails.category,
            description:proDetails.description,
            image:imgPath
    }
    const update = await productDb.updateOne({_id:proId},{$set:  product})
        return update;
}

exports.deleteProduct = async (id)=>{ 
    const dlt= await productDb.findByIdAndDelete(id)
    // console.log(dlt,'Deletinggg');
    // return;
}

exports.product = async (proId)=>{
    const product = await productDb.findById(proId)
    const productPrice = product.price;
    return productPrice;      
}

// ---------offers admin side-------- //

exports.productOffer = async ()=>{
    const products = await productDb.find()
    // console.log(products,'______________________')
    return products;
}


// exports.offerProduct = async(req,res)=>{
//     const
// }