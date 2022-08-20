const cartServices = require('../services/cartService')
const orderDb = require('../model/orderModel')
const orderServices = require('../services/orderService')
const ObjectId = require('mongoose').Types.ObjectId;



exports.placeOrder = async(req,res)=>{
    console.log(req.body.userId,'*****************************************');
    const product = await cartServices.getCartProductList(req.body.userId)
    const totalPrice = await cartServices.totalAmount(req.body.userId)
    const orders = await orderServices.placeOrder(req.body,product,totalPrice)
    res.json({status:true})
}

exports.orders = async(req,res)=>{
    const orderDetails = await orderServices.orders()
    // console.log(orderDetails,'orders3333333445566');
    res.render('admin/orderManagement',{orderDetails})
}

// exports.cancelOrder = async(req,res)=>{
//     const id = req.params?.id;
//     const order = await orderDb.findOne({_id:ObjectId(id)})
//     const proId = order.products[0]._id
//     await orderDb.updateOne({_id:id},{$set: {"status":"Canceled"}})
//     await productDb.updateOne({"_id": ObjectId(proId)},
//     {
//         $inc: { Quantity : 1 }
//     })
//     res.redirect('/admin/admin-orders')
// }

exports.cancelOrder = async(req,res)=>{
    const id = req.params?.id;
    const order = await orderDb.findOne({_id:ObjectId(id)})
        const proId = order.products[0]._id
            await orderDb.updateOne({_id:id},{$set: {"status":"Canceled"}})
            res.redirect('/admin/orderManagement')

} 
exports.statusUpdate = async(req,res)=>{
    const status = await orderServices.updateStatus(req.body);
    res.json(true);
}

exports.myOrders = async(req,res)=>{
    let cartCount = await cartServices.count(req.session.user._id) 
    let myOrder = await orderServices.myOrders(req.session.user._id)

    res.render('user/my-orders',{cartCount,myOrder})
}
exports.cancelOrderUser = async(req,res)=>{
    const id = req.params?.id;
    const order = await orderDb.findOne({_id:ObjectId(id)})
        const proId = order.products[0]._id
            await orderDb.updateOne({_id:id},{$set: {"status":"Canceled"}})
            res.redirect('/my-orders')

} 