
let productDb = require('../model/productModel');
const ObjectId = require('mongoose').Types.ObjectId;



exports.editProducts = async (id)=>{
    const edit = await productDb.findOne({_id:id}); 
    return edit;
}

// ----- getting product details -----//
exports.productDetails = async(proId)=>{
       const prodDetails = await productDb.findById(ObjectId(proId));
       return prodDetails;
}

// -- for product offers --//
exports.products = async()=>{
    const product = productDb.find()
    return product;
}

exports.updateProduct = async (proId,proDetails)=>{
    let image = proDetails.image;
    if(image) {
        let date = Date.now();
        let uploadPath = `./public/images/${date}.jpeg`
        var imgPath = `images/${date}.jpeg`
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
     await productDb.findByIdAndDelete(id)
}

exports.product = async (proId)=>{
    const product = await productDb.findById(proId)
    const productPrice = product.price;
    return productPrice;      
}

// ---------offers admin side-------- //

exports.productOffer = async ()=>{
    const products = await productDb.find()
    return products;
}


