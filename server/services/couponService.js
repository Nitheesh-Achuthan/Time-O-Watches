const couponDb = require('../model/couponModel');
const couponUsedDb = require('../model/couponUsedModel');


exports.couponAdd = async(couponDetails)=>{
   await couponDetails.save()
};
exports.couponOffer = async()=>{
   const coupons = await couponDb.find()
   return coupons;
};

exports.deleteCoupon = async(couponId)=>{
    await couponDb.findByIdAndDelete(couponId);
};

exports.couponEdit = async(couponId)=>{
    const coupon = await  couponDb.findById(couponId);
    return coupon;
};

exports.couponUpdate = async (couponId,couponObj)=>{

    await couponDb.findByIdAndUpdate(couponId,{$set:couponObj});
};

exports.couponHistory = async()=>{
    const coupons = await couponUsedDb.aggregate([
        {
            $lookup: {
                from: 'userdbs',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },       
        {
            $project: {
                discount: 1,
                coupon:1,
                user: { $arrayElemAt: ['$user', 0] },
                // coupon: { $arrayElemAt: ['$coupon', 0] },
                date: { $dateToString: { date: '$date', format: '%d-%m-%Y' } }
            }
        }
    ]);
    return coupons;
}

// -----user side-------//

exports.couponDiscount = async (code,total) =>{
    const discount = await couponDb.findOne({code:code, status:true})
    return discount;
};

exports.couponUsed = async(user,code) =>{
    const usedCoupon = await couponUsedDb.findOne({user:user,coupon:code})
    return usedCoupon;
};

exports.coupon = async(usedCouponObj) =>{
    const couponUsed = new couponUsedDb(usedCouponObj);
    await couponUsed.save();
};