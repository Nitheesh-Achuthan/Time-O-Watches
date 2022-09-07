let orderDb = require('../model/orderModel');
let offerDb = require('../model/offerModel');

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
    console.log(product,'++++++++++++++++++++++++')
    return product;
}