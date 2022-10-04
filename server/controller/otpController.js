let userDb = require('../model/model');

var serviceSID = process.env.serviceSID
var accountSID = process.env.accountSID
var authToken = process.env.authToken
const client = require('twilio')(accountSID,authToken)

// --- otp page---
exports.otplogIn = (req,res)=>{
    res.render('user/otp-page',{error:""})
};

exports.otpCheck = async (req,res)=>{
    if(req.session.loggedIn) {
        res.redirect('/home')
    } else {
        const user = await userDb.findOne({mobile:req.body.number})
        if(user){ 
            if(user.isBlocked){
                req.session.error = 'You are Blocked!'
                res.redirect('/loginError')
                // res.render('user/login',{error:"u r blocked"})
            }else{
                client.verify
                .services(serviceSID)
                .verifications.create({
                    to:`+91${req.body.number}`,
                    channel : "sms"
                })
                req.session.number = req.body.number;
                req.session.error = ''
                res.redirect('/otp-number')
                // res.status(200).render('user/otp',{error:"",number:req.body.number})               
                
            } 
        }else {
            req.session.error = 'User not Exist!'
            res.redirect('/loginError')
            // res.render('user/login',{error:"user not exist"})
        }
    } 
};

exports.otpVerify = async (req,res)=>{
    if(req.session.loggedIn){
        res.redirect('/home')
    } else {
    const  otp  = req.body.otp
    client.verify
    .services(serviceSID)
    .verificationChecks.create({
        to:`+91${req.params.number}`,
        code: otp
    }).then(async(resp) =>{
        if(resp.valid) { 
            const user = await userDb.findOne({mobile:req.params.number})
            req.session.user = user;        
            req.session.loggedIn = true
            res.redirect('/home')
        } else {
           req.session.error = 'Invalid otp'
           req.session.number = req.params.number;
           res.redirect('/otp-number')
            
        }
        
       
      })
    }
}

exports.otpPage = async (req,res)=>{
   const error = req.session.error;
   const number = req.session.number;
   req.session.error = null;
   req.session.number=null;
   res.render('user/otp',{error,number})
}