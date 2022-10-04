
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
const otpController = require('../controller/otpController');
const ObjectId = require('mongoose').Types.ObjectId;

// ---- landing and home page ----//
userRoute.get('/',controller.logg)

// ---- user login ---//
userRoute.get('/login',controller.userLogIn)

// ---user signup
userRoute.get('/signUp',controller.userSignUp);

userRoute.post('/signUp',controller.Create);

// --- otp page---//
userRoute.get('/otplogin',otpController.otplogIn);

// ----- otp page mob----//
userRoute.post('/otp',otpController.otpCheck);

// ----- otp verification ---//
userRoute.post('/homePage/:number',otpController.otpVerify)

// ----- otp error page ----//
userRoute.get('/otp-number',otpController.otpPage)


// --- user login---//
userRoute.post('/home',controller.Find);

userRoute.get('/loginError',controller.logInError);

// ====================middleware for checking user====================//
userRoute.use((req, res, next) => {
    if (!req.session.loggedIn) {
        res.redirect("/");
    } else next();
});

userRoute.use(async (req,res,next) => {
   const userId = req.session.user?._id 
   const blocked = await userDb.findOne({_id:userId,isBlocked:true})
   if(blocked){
    req.session.user=null;
    req.session.loggedIn = false;
    res.redirect('/');
   } else next()
});

// -- user home---//
userRoute.get('/home',controller.logg);

// ---- product details---//
userRoute.get('/product-details/:id',productController.proDetails);

// middleware for query-- //
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

// --- user logout---//
userRoute.get('/logout',controller.logOut);

// ----cart----//
userRoute.get('/cart',cartController.cart);

userRoute.post('/add-to-cart/:id',cartController.addCart);

userRoute.post('/change-product-quantity',cartController.changeProductQuantity);

userRoute.post('/remove-product-cart',cartController.removeProCart)

userRoute.get('/checkout',cartController.checkout);

// --- address save--- //
userRoute.post('/saveaddress',saveAddressController.saveAddress);

// --- buy product from home---//
userRoute.get('/buy-now',orderController.buyNowFromHome);
  
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

userRoute.put('/remove-wishlist',wishlistController.removeWishlistProduct);

// -----offers-----//
userRoute.get('/offers',offerController.offerHome);
  
// --------- coupon -------------------//
userRoute.post("/applycoupon/:coupon/:total", couponController.applyCoupon);
   

module.exports=userRoute;    