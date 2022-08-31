const saveAddressDb = require('../model/saveAddressModel');
const saveAddressServices = require('../services/saveAddressService'); 

exports.saveAddress = async(req,res)=>{
    let user = req.session.user._id
    // console.log(req.body,user,'-------------------------------=============--------------');
    const address = await saveAddressServices.saveAddress(req.body,user)
    console.log(address,'_____________________');

    if(address.alreadySaved) {
    res.json({error:"Address Already Saved"})
 } else {
     await saveAddressServices.save(address.saveAddress);

    //  console.log(saveAddress,'kkkkkkkkkkkkkkkkkkkkkkkvvvvvvvvvvvvvvvvvvvvvvkkkkkkkkk');

 res.json({status:true})
}
}
