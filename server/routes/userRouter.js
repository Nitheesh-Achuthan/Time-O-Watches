
const express = require('express');
const userRoute=express.Router();
const userDb = require('../model/model');
const productDb = require('../model/productModel');
const adminDb = require('../model/adminModel');
const controller = require('../controller/controller');
const productController = require('../controller/productController');
const saveAddressController = require('../controller/saveAddressController');
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderController');
const cartServices = require('../services/cartService'); 
const ObjectId = require('mongoose').Types.ObjectId;


const serviceSID = process.env.serviceSID
const accountSID = process.env.accountSID
const authToken = process.env.authToken
const client = require('twilio')(accountSID,authToken)


// userRoute.get('/',controller.landing)


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

userRoute.post('/otp',(req,res)=>{
    try {
        console.log('number',req.body.number)
        client.verify
           .services(serviceSID)
            .verifications.create({
                to:`+91${req.body.number}`,
                channel : "sms"
            })
            res.status(200).render('user/otp',{error:"",number:req.body.number})
        
    } catch (error) {
        log(error)
    }
}); 

userRoute.post('/homePage/:number',(req,res)=>{
    // console.log(req.params.number,'kkkk');
    const { otp } = req.body
    client.verify
      .services(serviceSID)
      .verificationChecks.create({
        to:`+91${req.params.number}`,
        code: otp
      })
    //   .then(() =>{
        // console.log('otp res',res);
        req.session.loggedIn = true;
        res.redirect('/home')
        
       
    //   })
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


userRoute.get('/product-details/:id', async (req,res)=>{

    let cartCount = await cartServices.count(req.session.user._id) 

    const proDetails = await productDb.findById(ObjectId(req.params.id))
 res.render('user/product-details',{watches:proDetails,cartCount})
})




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



  
 
   

module.exports=userRoute;    