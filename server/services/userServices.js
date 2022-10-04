let userDb = require('../model/model');
const ObjectId = require('mongoose').Types.ObjectId;

// --- new user saving--//
exports.saveUser = async (userObj) =>{
    const user = new userDb(userObj);
    return user;
};
// --- user finding---
exports.getUser = async(email,password) =>{
    const user = await userDb.findOne({ email:email, password:password });   
    return user;
} 
// ---- 
exports.myProfile= async (userId) => {
    const user = await userDb.findOne({_id:userId})
    return user;
}
exports.profileEdit = async (userId,userDetails)=>{
    await userDb.updateOne({_id:userId},{
        $set:{
            firstName:userDetails.fname,  
            lastName:userDetails.lname,
            email:userDetails.email,
            mobile:userDetails.mobile
        }
    })
}
exports.passwordChange = async (body,userId)=>{
    let user = await userDb.findOne({_id:userId,password:body.oldPswd})
    return user;
    
}
exports.updatePassword = async (body,userId) =>{
    await userDb.updateOne({_id:userId},{
        $set:{
            password:body.confirmPsw
        }
    })
};

