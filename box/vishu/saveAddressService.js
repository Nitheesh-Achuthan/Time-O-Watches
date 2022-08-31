const saveAddressModel = require('../model/saveAddressModel');
const saveAddressDb = require('../model/saveAddressModel');
const ObjectId = require('mongoose').Types.ObjectId;


exports.saveAddress = async (body,userID)=>{
    console.log(body,'2222222222222222222222222222222222222222');
   let saveObj = {
    userId:userID,
    firstName:body.firstname,
    lastName:body.lastname,
    mobile:body.mobile,
    email:body.email,
    country:body.country,
    address:body.address,
    date:Date.now()
   };
   const checkObj = {
    userId:userID,
    firstName:body.firstname,
    lastName:body.lastname,
    mobile:body.mobile,
    email:body.email,
    country:body.country,
    address:body.address
   };
   const alreadySaved = await saveAddressDb.findOne(checkObj);
   console.log(alreadySaved,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
   const saveAddress = new saveAddressDb(saveObj);
   if(alreadySaved) {
       res.json({error:"Already Saved"})
    } else {
        await saveAddress.save();
        console.log(saveAddress,'kkkkkkkkkkkkkkkkkkkkkkkvvvvvvvvvvvvvvvvvvvvvvkkkkkkkkk');

    res.json({saveAddress})
   }
}
