
const express = require('express');
const userRoute=express.Router();
const userDb = require('../model/model');
const productDb = require('../model/productModel');
const adminDb = require('../model/adminModel');
const offerDb = require('../model/offerModel');
const wishlistDb = require('../model/wishlistModel');
let cartDb = require('../model/cartModel');
const controller = require('../controller/controller');
const productController = require('../controller/productController');
const saveAddressController = require('../controller/saveAddressController');
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderController');
const offerController = require('../controller/offerController');
const couponController = require('../controller/couponController');
const wishlistController = require('../controller/wishlistController');

const cartServices = require('../services/cartService'); 
const ObjectId = require('mongoose').Types.ObjectId;


var serviceSID = process.env.serviceSID
var accountSID = process.env.accountSID
var authToken = process.env.authToken
const client = require('twilio')(accountSID,authToken)


userRoute.get('/',controller.landing)


userRoute.get('/',(req,res)=>{
    
    if(req.session.loggedIn){
        
        res.redirect('/home')
    }else
    res.render('user/login',{error:''});
});

userRoute.get('/signUp',(req,res)=>{
    res.render('user/signup');   
});

userRoute.post('/signUp',controller.Create);

userRoute.post('/otp',async (req,res)=>{
     if(req.session.loggedIn) {
            res.redirect('/home')
        } else {
            const user = await userDb.findOne({mobile:req.body.number})
            if(user){ 
                   if(user.isBlocked){
                        res.render('user/login',{error:"u r blocked"})
                    }else{
                        client.verify
                        .services(serviceSID)
                            .verifications.create({
                                to:`+91${req.body.number}`,
                                channel : "sms"
                            })

                                res.status(200).render('user/otp',{error:"",number:req.body.number})
                         
                            
                        } 
                }else {
                    res.render('user/login',{error:"user not exist"})
                }
            }
     
}); 

userRoute.post('/homePage/:number',async(req,res)=>{
    if(req.session.loggedIn){
        res.redirect('/home')
    } else {
    const  otp  = req.body.otp
    console.log(otp,'999999999999999999999999999999999999')
    client.verify
    .services(serviceSID)
    .verificationChecks.create({
        to:`+91${req.params.number}`,
        code: otp
    }).then(async(resp) =>{
        console.log(resp,'____________++++++++++++++00000000')
        if(resp.valid) {
            const user = await userDb.findOne({mobile:req.params.number})
            req.session.user = user;
            const userId = req.session.user?._id
            let cartCount = 0
            let cart = await cartDb.findOne({user:user._id})
            if(cart) {
                cartCount = cart.products.length
            }
            const offers = await offerDb.aggregate([
                {  
                    $lookup:{
                        from:'productDb',
                        localField:'proId',
                        foreignField:'_id',
                        as:'products'
                    }
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        id:'$products._id',
                        price:'$products.price',
                        products:'$products',
                        percentage:'$percentage',
                        offerPrice:{$divide:[{$multiply:['$products.price','$percentage']},100]}
                    }
                }
            ])  
            const product = await productDb.find()
            const wishlist = await wishlistDb.findOne({user:ObjectId(userId)})
            fav = wishlist?.products
            req.session.loggedIn = true;
            res.redirect('/home')
        } else {
            res.render('user/otp',{error:"invalid otp",number:req.params.number})

        }
        // console.log('otp res',res);        
        // res.redirect('/home')   
       
      })
    } 
})

userRoute.post('/home',controller.Find);

userRoute.get('/watch',(req,res)=>{
      res.render('user/watch',{error:""})
});

// ====================middleware for checking user====================//
userRoute.use((req, res, next) => {
    if (!req.session.loggedIn) {
        res.redirect("/");
    } else next();
});

userRoute.use(async (req,res,next) => {
   const userId = req.session.user._id 
   const blocked = await userDb.findOne({_id:userId,isBlocked:true})
   if(blocked){
    req.session.user=null;
    req.session.loggedIn = false;
    res.redirect('/');
   } else next()
})
 

  
userRoute.get('/home',controller.logg);


userRoute.get('/product-details/:id',productController.proDetails)




// middleware //
userRoute.use((req, res, next) => {
    if (req.query._method == "DELETE") {
        req.method = "DELETE";
        req.url = req.path;
    } else if (req.query._method == "PUT") {
        req.method = "PUT";
        req.url = req.path;
    }
    next();
});






userRoute.get('/logout',(req,res)=>{
    req.session.loggedIn = false;
    req.session.user = null;
    res.redirect('/') 
})

userRoute.get('/cart',cartController.cart);

userRoute.post('/add-to-cart/:id',cartController.addCart);

userRoute.post('/change-product-quantity',cartController.changeProductQuantity);

userRoute.post('/remove-product-cart',cartController.removeProCart)

userRoute.get('/buy-now',orderController.buyNowFromHome);

userRoute.get('/checkout',cartController.checkout);

userRoute.post('/saveaddress',saveAddressController.saveAddress)
  
// place order from home //
userRoute.post('/place-order-fromhome',orderController.placeOrderHome)

userRoute.post('/verify-payment-buynow',orderController.paymentOnline)

// place order from cart //
userRoute.post('/place-order',orderController.placeOrder)

userRoute.post('/verify-payment',orderController.razorPay)

userRoute.get('/my-orders',orderController.myOrders)

userRoute.put('/cancel-order-user/:id',orderController.cancelOrderUser)

userRoute.get('/my-account',controller.myAccount)

userRoute.post('/profile-edit',controller.profileEdit)

userRoute.get('/change-pwd',controller.changePswd)

userRoute.post('/newpassword',controller.newPassword)

userRoute.get('/pswdChangeErr',controller.passwordChangeErr)

//  ------- order Success ------//
userRoute.get('/order-success',orderController.success)

// -------- wishlist--------//
userRoute.post('/add-to-wishlist/:id',wishlistController.addToList);

userRoute.get('/my-wishlist',wishlistController.wishlistPage);

// userRoute.put('/remove-wishlist',wishlistController.removeWishlistProduct);
userRoute.put('/remove-wishlist',wishlistController.removeWishlistProduct)
// (req,res)=>{
//     console.log(req.body,'------------------88888888888')
// })


// -----offers-----//
userRoute.get('/offers',offerController.offerHome)


  
// --------- coupon -------------------//

userRoute.post("/applycoupon/:coupon/:total", couponController.applyCoupon)
   

module.exports=userRoute;    