
const express = require('express');
const userRoute=express.Router();
const userDb = require('../model/model');
const productDb = require('../model/productModel');
const adminDb = require('../model/adminModel');
const controller = require('../controller/controller');
const productController = require('../controller/productController');
const ObjectId = require('mongoose').Types.ObjectId;


const serviceSID = "VAa9d484d4fe0ce76a3df8c3e6eb0caf47"
const accountSID = "AC8d5751b125bce56604241cf950a916f1"
const authToken = "22d9a23a92f37a469b4b6e1f5cf02f41"
const client = require('twilio')(accountSID,authToken)

userRoute.get('/',(req,res,next)=>{
    
    // let user=req.session.user
    // console.log(user);
    if(req.session.loggedIn){
        res.redirect('/home')
    }else
    res.render('user/login',{error:''});
});

userRoute.get('/signUp',(req,res)=>{
    res.render('user/signup');   
});


userRoute.post('/signUp',controller.Create);

userRoute.get('/home',controller.logg);

userRoute.post('/home',controller.Find);

userRoute.get('/watch',(req,res)=>{
      res.render('user/watch',{error:""})
});

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
    console.log(req.params.number,'kkkk');
    const { otp } = req.body
    client.verify
      .services(serviceSID)
      .verificationChecks.create({
        to:`+91${req.params.number}`,
        code: otp
      })
    //   .then(() =>{
        // console.log('otp res',res);
        console.log(' im refgh');
        req.session.loggedIn = true;
        res.redirect('/home')
        
       
    //   })
})



userRoute.get('/product-details/:id', async (req,res)=>{
    const proDetails = await productDb.findById(ObjectId(req.params.id))
 res.render('user/product-details',{watches:proDetails})
})


userRoute.get('/logout',(req,res)=>{
    req.session.loggedIn = null
    req.session.user = null
    res.redirect('/')
})

  
 


module.exports=userRoute; 