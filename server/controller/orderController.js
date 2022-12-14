const cartServices = require('../services/cartService');
const offerServices = require('../services/offerService');

const orderDb = require('../model/orderModel');
let productDb = require('../model/productModel');

const orderServices = require('../services/orderService')
const productServices = require('../services/productService')
const saveAddressServices = require('../services/saveAddressService')

const Razorpay = require('razorpay');
const crypto = require('crypto');

const ObjectId = require('mongoose').Types.ObjectId;

var instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret
});

exports.buyNowFromHome = async (req,res)=>{
    try {
        proId = req.query.id;
        user = req.session.user;
        const savedAddress = await saveAddressServices.addressSaved(user._id);
        let offerPro = await offerServices.offerProduct(proId);
        let offer = await offerServices.productDetailsOffer(proId); 
        offer = parseInt(offer[0]?.offerPrice); 
    
    
        const cartCount = await cartServices.count(user._id)
        const product = await productServices.product(proId)
        
        if(offer >0){
            res.render('user/checkoutFromHome',{cartCount,user,savedAddress,total:offer,proId,userlogIn:req.session.loggedIn})
        } else {
            res.render('user/checkoutFromHome',{cartCount,user,savedAddress,total:product,proId,userlogIn:req.session.loggedIn})
        }
    } catch (error) {
        res.render('error')
    }
}

exports.placeOrderHome = async (req,res)=>{

    const proId = req.body.proId
    const productPrice = req.body.total
    let product = [{item:ObjectId(proId),quantity:1}]
    const orderId = await orderServices.placeOrderFromHome(req.body,product,productPrice,proId);
    const proQty = await orderServices.productQty(product)
    req.session.products = [proId];
    req.session.orderId = orderId;



    if (req.body['paymentmethod'] === 'Cash On Delivery') {

        res.json({ codSuccess: true })
    } else if (req.body['paymentmethod'] == 'Online') {
        
        await orderServices.orderStatus(orderId, 'Failed')
       



        var options = {
            "amount": productPrice*100,
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
                res.json(order);

            }
        })

    }
}

exports.paymentOnline = async (req, res) => {
    try {
        let hmac = crypto.createHmac('sha256', 'AE2ZJl3M0PGUSD5YkihGECVZ');
        hmac.update(req.body.payment.razorpay_order_id+'|'+ req.body.payment.razorpay_payment_id);
        hmac = hmac.digest('hex')
        if (hmac == req.body.payment.razorpay_signature) {
            await orderServices.orderStatus(req.body.order.receipt, "Ordered")

            res.json({ status: true })
        
        } else {   
            console.log(err);   
            res.json({ status: false, errMsg: '' })
        }
    } catch (error) {
        res.status(500).send(error)
    }            
}

// ---order placed from cart---//

exports.placeOrder = async (req, res) => {
    
    const product = await cartServices.getCartProductList(req.body.userId)
    const totalPrice = parseInt(req.body.total);
   
    const orderId = await orderServices.placeOrder(req.body, product, totalPrice);
    const proQty = await orderServices.productQty(product)
    const productIds = [];
    for (const proId of product) {
        productIds.push(proId.item)
    }
    req.session.products = productIds;
    req.session.orderId = orderId;

    if (req.body['paymentmethod'] === 'Cash On Delivery') {

        res.json({ codSuccess: true })
    } else if (req.body['paymentmethod'] == 'Online') {
        
        await orderServices.orderStatus(orderId, 'Failed')       

        
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
                res.send(err);
            } else {

                res.json(order);

            }
        })

    }      
}

exports.razorPay = async (req, res) => {
    try {
        let hmac = crypto.createHmac('sha256', 'AE2ZJl3M0PGUSD5YkihGECVZ');
        hmac.update(req.body.payment.razorpay_order_id+'|'+ req.body.payment.razorpay_payment_id);
        hmac = hmac.digest('hex')
        if (hmac == req.body.payment.razorpay_signature) {
            await orderServices.orderStatus(req.body.order.receipt, 'Ordered')
            
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
    res.render('admin/orderManagement', { orderDetails })
    
}

// --------
exports.orderProducts = async(req,res)=>{
    const orderDetails = await orderServices.orderedProduct(req.params.id)
    res.render('admin/orderedProducts', { orderDetails })
}

 

// ------ Order Success ------///

exports.success = async (req,res)=>{
    const proId = req.session.products
    const orderId = req.session.orderId
    const order = await orderDb.findOne({_id:orderId})
    const { deliveryDetails } = order
    const products = await productDb.find({_id: {$in:proId}})
    res.render('user/order-success',{products,order,deliveryDetails})
}



// ---admin side----//
exports.cancelOrder = async (req, res) => {
    const id = req.params?.id;
    const order = await orderDb.findOne({ _id: ObjectId(id) })
    const proItems = order.products
    const proQty = await orderServices.cancelProQuantity(proItems)
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
    let user = req.session.user
    res.render('user/my-orders', { cartCount, myOrder,userlogIn:req.session.loggedIn,user})
}
exports.cancelOrderUser = async (req, res) => {
    const id = req.params?.id;
    const order = await orderDb.findOne({ _id: ObjectId(id) })
    const proItems = order.products  
    const proQty = await orderServices.cancelProQuantity(proItems)   
    await orderDb.updateOne({ _id: id }, { $set: { "status": "Canceled" } })

    res.redirect('/my-orders')

};


// ------------ ord details admin side------//
exports.ordDetails = async(req,res) =>{
    res.render('admin/orderProds')
};