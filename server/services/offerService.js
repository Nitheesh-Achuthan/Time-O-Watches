let offerDb = require('../model/offerModel');
const ObjectId = require('mongoose').Types.ObjectId;


exports.totalOffers = async()=>{
   const offers =  await offerDb.find()
   return offers;
}
exports.offer = async(proDetails)=>{
    console.log(proDetails)
   await proDetails.save()
}

exports.proOffer = async()=>{
    const product = await offerDb.aggregate([
        {
            $lookup:{
                from:'productDb',
                localField:'proId',
                foreignField:'_id',
                as:'proDetail'
            }
        }
    ])
    return product;
}

exports.deleteOffer = async(offerId)=>{
     await offerDb.findByIdAndDelete(offerId);
}

exports.prodOffer = async(offerId)=>{
  const offer = await  offerDb.findById(offerId);
  return offer;
}

exports.offerUpdate = async (offerId,offerObj)=>{

    await offerDb.findByIdAndUpdate(offerId,{$set:offerObj});
};

// --------- to find offerproducts from controller ----//

exports.offers = async ()=>{
    const offerProducts = await offerDb.aggregate([
        {
            $match: {
                status: true
            }
        },
        {
            $lookup:{
                from:'productDb',
                localField:'proId',
                foreignField:'_id',
                as:'proDetail'
            }
        },
        {
            $unwind:'$proDetail'
        },
        {
            $project:{
                id:'$proDetail._id',
                price:'$proDetail.price',
                products:'$proDetail',
                percentage:'$percentage',
                offerPrice: {$subtract: ['$proDetail.price',{$divide: [{ $multiply: ['$proDetail.price','$percentage']},100]}]}
            }
        }
    ])
    return offerProducts;
};

// ---- taking offer for single products from product details userside----//


exports.offerProduct = async(productId)=>{
        let offerPro = await offerDb.findOne({proId:productId,status:true})
        return offerPro;
}


exports.productDetailsOffer = async(proId)=>{
    const product = await offerDb.aggregate([
        {
            $match:{
                proId: ObjectId(proId)
            }
        },
        {
            $lookup:{
                from:'productDb',
                localField:'proId',
                foreignField:'_id',
                as:'proDetail'
            }
        },
        {
            $unwind:'$proDetail'
        },
        {
            $project:{
                id:'$proDetail._id',
                price:'$proDetail.price',
                products:'$proDetail',
                percentage:'$percentage',
                offerPrice: {$subtract: ['$proDetail.price',{$divide: [{ $multiply: ['$proDetail.price','$percentage']},100]}]}
            }
        }
    ])
    console.log(product,'***************************************');
    return product;
}