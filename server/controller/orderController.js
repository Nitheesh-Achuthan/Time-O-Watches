const cartServices = require('../services/cartService')
const orderDb = require('../model/orderModel')
const orderServices = require('../services/orderService')
const Razorpay = require('razorpay')
const crypto = require('crypto');

const ObjectId = require('mongoose').Types.ObjectId;

var instance = new Razorpay({
    key_id: 'rzp_test_MoPjF88yCdpr2R',
    key_secret: '9KEIrz0MsZbicVP13JQc5N3u'
});



exports.placeOrder = async (req, res) => {
    // console.log(req.body,'*****************************************');
    const product = await cartServices.getCartProductList(req.body.userId)
    const totalPrice = await cartServices.totalAmount(req.body.userId)
    const orderId = await orderServices.placeOrder(req.body, product, totalPrice)
    // console.log(orderId,'-=-=-=-===-=-=-=-=-=-=-=-=-========================--------------------'); 

    if (req.body['paymentmethod'] === 'Cash On Delivery') {

        res.json({ codSuccess: true })
    } else if (req.body['paymentmethod'] == 'Online') {
        // let order = await orderServices.generateRazorpay(orders,totalPrice)
        // console.log("New Order----------",order);
        await orderServices.orderStatus(orderId, 'Failed')
        // await orderDb.updateOne({_id:orderId},
        //    { $set: {
        //         status:'Failed'
        //     }})



        var options = {
            "amount": totalPrice * 100,
            "currency": "INR",
            "receipt": '' + orderId,
            // "partial_payment": false,
            // "notes": {
            //   "key1": "value3",
            //   "key2": "value2"
            // }
        }
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.log(err);
                res.send(err.message);
            } else {
                console.log("New Order+++++++++++", order);
                res.json(order);


            }
        })

    }      
}

exports.razorPay = async (req, res) => {
    try {
        let hmac = crypto.createHmac('sha256', '9KEIrz0MsZbicVP13JQc5N3u');
        hmac.update(req.body.payment.razorpay_order_id+'|'+ req.body.payment.razorpay_payment_id);
        hmac = hmac.digest('hex')
        if (hmac == req.body.payment.razorpay_signature) {
            await orderServices.orderStatus(req.body.order.receipt, "Ordered")
            console.log("userId",req.session.user._id)
            await cartServices.deleteCart(req.session.user._id)

            res.json({ status: true })
        
        } else {   
            console.log(err);   
            res.json({ status: false, errMsg: '' })
        }
    } catch (error) {
        res.status(500).send(error)
    }            
}
      
exports.orders = async (req, res) => {
    const orderDetails = await orderServices.orders()
    // console.log(orderDetails,'orders3333333445566');
    res.render('admin/orderManagement', { orderDetails })
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

exports.cancelOrder = async (req, res) => {
    const id = req.params?.id;
    const order = await orderDb.findOne({ _id: ObjectId(id) })
    const proId = order.products[0]._id
    await orderDb.updateOne({ _id: id }, { $set: { "status": "Canceled" } })
    res.redirect('/admin/orderManagement')

}
exports.statusUpdate = async (req, res) => {
    const status = await orderServices.updateStatus(req.body);
    res.json(true);
}

exports.myOrders = async (req, res) => {
    let cartCount = await cartServices.count(req.session.user._id)
    let myOrder = await orderServices.myOrders(req.session.user._id)

    res.render('user/my-orders', { cartCount, myOrder })
}
exports.cancelOrderUser = async (req, res) => {
    const id = req.params?.id;
    const order = await orderDb.findOne({ _id: ObjectId(id) })
    const proId = order.products[0]._id
    await orderDb.updateOne({ _id: id }, { $set: { "status": "Canceled" } })
    res.redirect('/my-orders')

} 