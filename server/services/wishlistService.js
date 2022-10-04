const wishlistDb = require('../model/wishlistModel');
const ObjectId = require('mongoose').Types.ObjectId;


exports.addToWishlist = async(proId,user)=>{ 

    const userWishlist = await wishlistDb.findOne({user:user._id})
    if(userWishlist) {
        let proExist = userWishlist.products.findIndex(product=> product.item == proId);
        if(proExist!=-1){
            await wishlistDb.updateOne({user:user._id},
               {
                $pull:{products:{item:ObjectId(proId)}}
               })
        } else {
            await wishlistDb.updateOne({user:user._id},
                { $push: {products:{item:ObjectId(proId)}}})
        }

    } else {
        let wishlistObj = new wishlistDb({
            user:user._id,
            products:[{item:ObjectId(proId)}]
        })
        wishlistObj.save()
    }
};

exports.wishlistPros = async(userId) =>{
    const products = await wishlistDb.aggregate([
        {
            $match:{user:ObjectId(userId)}
        },
        {
            $unwind:'$products'
        },
        {
            $project:{
                item:'$products.item'
            }
        },
        {
            $lookup:{
                from:'productDb',
                localField:'item',
                foreignField:'_id',
                as:'product'
                
            }
        },
        {
            $project:{
                product: { $arrayElemAt: ['$product',0]}  
            }
        }
    ])
    return products;
};

exports.wishlistRemove = async(proId,userId)=>{
    await wishlistDb.updateOne({user:ObjectId(userId)},
        {
            $pull:{products:{item:ObjectId(proId)}}
        })
}; 
// -----fav color -----

// exports.favourites = async(userId)=>{
//     const fav = await wishlistDb.findOne({user:userId});
//     return fav;
// };