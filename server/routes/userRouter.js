
const express = require('express');
const userRoute=express.Router();
const userDb = require('../model/model');
const productDb = require('../model/productModel');
const adminDb = require('../model/adminModel');
const controller = require('../controller/controller');
const productController = require('../controller/productController');
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderController');
const cartServices = require('../services/cartService'); 
const ObjectId = require('mongoose').Types.ObjectId;


const serviceSID = process.env.serviceSID
const accountSID = process.env.accountSID
const authToken = process.env.authToken
const client = require('twilio')(accountSID,authToken)

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

userRoute.get('/watch',(req,res)=>{
      res.render('user/watch',{error:""})
});

userRoute.get('/product-details/:id', async (req,res)=>{

    let cartCount = await cartServices.count(req.session.user._id) 

    const proDetails = await productDb.findById(ObjectId(req.params.id))
 res.render('user/product-details',{watches:proDetails,cartCount})
})


// userRoute.get('/product-details',(req,res)=>{
//     const proid = req.session.productId 
//     console.log(proid);
//     res.render('user/product-details',{watches:proid})

// })


// userRoute.use((req, res, next) => {
//     if (req.query._method == "DELETE") {
//         req.method = "DELETE";
//         req.url = req.path;
//     } else if (req.query._method == "PUT") {
//         req.method = "PUT";
//         req.url = req.path;
//     }
//     next();
// });



userRoute.get('/logout',(req,res)=>{
    req.session.loggedIn = null
    req.session.user = null
    res.redirect('/') 
})

userRoute.get('/cart',cartController.cart);

userRoute.get('/add-to-cart/:id',cartController.addCart);

userRoute.post('/change-product-quantity',cartController.changeProductQuantity);

userRoute.post('/remove-product-cart',cartController.removeProCart)

userRoute.get('/checkout',cartController.checkout);
// async (req,res)=>{

    // let cartCount = await cartServices.count(req.session.user._id) 

    // res.render('user/checkout',{cartCount})
// })

// userRoute.post('/order-data',orderController.create)
userRoute.post('/place-order',orderController.placeOrder)


  
 
   

module.exports=userRoute;    