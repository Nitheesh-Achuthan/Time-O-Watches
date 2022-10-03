const saveAddressModel = require('../model/saveAddressModel');
const saveAddressDb = require('../model/saveAddressModel');
const ObjectId = require('mongoose').Types.ObjectId;

// ------------ To Save Address------------//

exports.saveAddress = async (body,userID)=>{
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
   const saveAddress = new saveAddressDb(saveObj);
   return {saveAddress,alreadySaved};
}
exports.save = async (saveAddress)=>{
    saveAddress.save()
}
// ---------- To find already saved addresses -------------- //

exports.addressSaved = async (userID)=>{
       const savedAddress = await saveAddressDb.find({userId:userID})
       return savedAddress;
}




