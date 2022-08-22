let cartDb = require('../model/cartModel');
const ObjectId = require('mongoose').Types.ObjectId;

exports.addToCart = async (proId,userId)=>{
    let proObj = {
        item:ObjectId(proId),
        quantity:1
    }
    const userCart = await cartDb.findOne({user:ObjectId(userId)})
    if(userCart){
       
     let proExist = userCart.products.findIndex(product=> product.item==proId)
     console.log(proExist);
     if(proExist!=-1){
        await cartDb.updateOne({user:ObjectId(userId),'products.item':ObjectId(proId)},
        {
            $inc:{'products.$.quantity':1}
        })
     } else{

       await cartDb.updateOne({user:ObjectId(userId)},
      {
        $push: {products: proObj }
      }
      )}
    }else{ 
        let cartObj = new cartDb({
            user:userId,
            products:[proObj]
        })
        cartObj.save()
    }
    return;
}  

exports.cartView = async (userId)=>{
    const cartItems = await cartDb.aggregate([
        {
            $match:{user:ObjectId(userId)}
        },
        {
            $unwind:"$products"
        },
        {
            $project:{
                item:'$products.item',
                quantity:'$products.quantity'
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
                item:1,quantity:1,product: { $arrayElemAt: ['$product',0]}  
            }
        }
    ])  

    return cartItems;
}      

exports.count = async(userId)=>{
    let count = 0
    const cart = await cartDb.findOne({user:ObjectId(userId)})
    if(cart){
        count = cart.products.length
    }
    return count;  
}

exports.changeQty = async(details)=>{
    details.count = parseInt(details.count)
    details.quantity = parseInt(details.quantity)
    let cartProduct = {}
    if(details.count==-1 && details.quantity==1){

         cartProduct = await cartDb.updateOne({_id:ObjectId(details.cart)},
            {
               $pull:{products:{item:ObjectId(details.product)}}

            })
            cartProduct.removeProduct = true;
            
            
        }
        else{
            await cartDb.updateOne({_id:ObjectId(details.cart),'products.item':ObjectId(details.product )},
            {
                $inc:{'products.$.quantity':details.count}
            })
            
        }
        return cartProduct;

 } 
 exports.removeProduct = async (body)=>{
    const cartId = body.cart;
    const proId = body.product;
    const product = await cartDb.updateOne({_id:ObjectId(cartId)},
    {
        $pull:{products:{item:ObjectId(proId)}}
    })
    return product;
}

exports.totalAmount = async (userId)=>{
  const total = await cartDb.aggregate([
    {
        $match:{user:ObjectId(userId)}
    },
    {
        $unwind:'$products'
    },
    {
        $project:{
            item:'$products.item',
            quantity:'$products.quantity'
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
            item:1,quantity:1,product: {$arrayElemAt: ['$product',0]}
        }
    },
    {
        $group:{
            _id:null,
            total:{$sum:{$multiply:['$quantity','$product.price']}}
        }
    }
  ])
  return total[0]?.total;
}


exports.getCartProductList = async(userId)=>{
 const cart = await cartDb.findOne({user:ObjectId(userId)})
 return cart.products;
}
// === from ordercontroller ===//
 exports.userCart = async(userId)=>{
  let cart=  await cartDb.findOne({user:userId})
  return cart;
}
 