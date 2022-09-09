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