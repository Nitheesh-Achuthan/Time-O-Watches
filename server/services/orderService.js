const orderDb = require('../model/orderModel')
const cartDb = require('../model/cartModel')
let productDb = require('../model/productModel');

const ObjectId = require('mongoose').Types.ObjectId;


// --- order placed from home page ---/

exports.placeOrderFromHome = async (order,products,productPrice,proId) => {
    let status = order.paymentmethod === 'Cash On Delivery' ? 'Ordered' : 'Pending'
    let orderObj = new orderDb ({
        deliveryDetails: {
            firstName: order.fname,
            lastName: order.lname,
            mobile: order.number,
            email: order.email,
            country: order.country,
            address: order.address

        }, 
            userId:ObjectId(order.userId),
            paymentMethod:order.paymentmethod,
            totalAmount:productPrice,

            products:products,
            status:status,
            date:new Date()
    })

    const orders = await orderObj.save() 
    return orders._id;

};

// -- order placed from cart --//

exports.placeOrder = async (order, product, totalPrice) => {
    let status = order.paymentmethod === 'Cash On Delivery' ? 'Ordered' : 'Pending'
    let orderObj = new orderDb ({
        deliveryDetails: {
            firstName: order.fname,
            lastName: order.lname,
            mobile: order.number,
            email: order.email,
            country: order.country, 
            address: order.address

        }, 
            userId:ObjectId(order.userId),
            paymentMethod:order.paymentmethod,
            totalAmount:totalPrice,

            products:product,
            status:status,
            date:new Date()
    })

    const orders = await orderObj.save()

    if(status == 'Ordered'){
        await cartDb.deleteOne({user:ObjectId(order.userId)})
    }
    return orders._id;

};

// ------ product quantity decreased when order placed----//
exports.productQty = async(product)=>{
    for (const pro of product) {
        await productDb.updateOne({_id:ObjectId(pro.item)},{$inc: { quantity: -pro.quantity} }) 
        } 
};

exports.orderStatus =  async (orderId,status) =>{
     await orderDb.updateOne({_id:ObjectId(orderId)},
        {
            $set:{status}
        })     
};                            


exports.orders = async () => {  
    const orders = await orderDb.find();
    return orders;
};

exports.updateStatus = async (datas) => {
    let status = datas.status;
    let orderId = datas.orderId;
    await orderDb.updateOne({ _id: ObjectId(orderId) },
        {
            $set: { status: status }
        })
};

// ---- order manage admin side ----//

exports.orderedProduct = async (orderId) =>{
    const orderedProducts = await orderDb.aggregate([
        {
            $match:{_id: ObjectId(orderId)}
        },
        {
            $unwind:'$products'
        },
        {
            $project: {
                deliveryDetails: 1, userId: 1, paymentMethod: 1, date: 1,
                totalAmount: 1, status: 1, 
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
                deliveryDetails: 1, userId: 1, paymentMethod: 1, date: 1,
                totalAmount: 1, status: 1, 
                item:1,quantity:1,product: { $arrayElemAt:['$product',0]}
            }
        }
    ])
    return orderedProducts;
};




exports.myOrders = async(userId)=>{
    const orders = await orderDb.aggregate([
        {
            $match:{userId:ObjectId(userId)}
        },
        {
            $unwind:'$products'
        },
        {
            $project: {
                deliveryDetails: 1, userId: 1, paymentMethod: 1, date: 1,
                totalAmount: 1, status: 1, 
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
                deliveryDetails: 1, userId: 1, paymentMethod: 1, date: 1,
                totalAmount: 1, status: 1, 
                item:1,quantity:1,product: { $arrayElemAt:['$product',0]}
            }
        }
    ])
   return orders;
}

// ----- quantity increased when order canceled from both admin and user side----//

exports.cancelProQuantity = async(proItems)=>{
    for (const pro of proItems) {
        await productDb.updateOne({_id:ObjectId(pro.item)},{$inc: { quantity: +pro.quantity} }) 
        } 
    };
