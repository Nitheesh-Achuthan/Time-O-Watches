const saveAddressDb = require('../model/saveAddressModel');
const saveAddressServices = require('../services/saveAddressService'); 

exports.saveAddress = async(req,res)=>{
    let user = req.session.user._id
    const address = await saveAddressServices.saveAddress(req.body,user)

    if(address.alreadySaved) {
    res.json({error:"Address Already Saved"})
 } else {
     await saveAddressServices.save(address.saveAddress);

     res.json({status:true})
}
}
