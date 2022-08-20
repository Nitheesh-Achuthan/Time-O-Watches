const orderDb = require('../model/orderModel')
const cartDb = require('../model/cartModel')
const productDb = require('../model/productModel')
const ObjectId = require('mongoose').Types.ObjectId;


exports.placeOrder = async (order, product, totalPrice) => {
    let status = order.paymentmethod === 'cash on delivery' ? 'ordered' : 'pending'
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
    const saving = await orderObj.save()
    await cartDb.deleteOne({user:ObjectId(order.userId)})

}


exports.orders = async () => {
    // const orderDetails = await orderDb.find();

    // console.log(orderDetails,'orfer444444444444444444');

    const orderPro = await orderDb.aggregate([
        {
            $unwind: "$products"
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
            $lookup: {
                from: 'productDb',
                localField: 'item',
                foreignField: '_id',
                as: 'product'

            }
        },
        {
            $project: {
                deliveryDetails: 1, userId: 1, paymentMethod: 1, date: 1,
                totalAmount: 1, status: 1,

                item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
            }
        }

    ])
    // console.log(orderPro,'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiioooooooooooooooooooooooooooooo');
    return orderPro;
}

exports.updateStatus = async (datas) => {
    let status = datas.status;
    let orderId = datas.orderId;
    // console.log(status,orderId,'this@@@@@@@@@@@@@@@@@@@@@@');
    await orderDb.updateOne({ _id: ObjectId(orderId) },
        {
            $set: { status: status }
        })
}
