let userDb = require('../model/model');
let adminDb = require('../model/adminModel');
let categoryDb = require('../model/categoryModel');
let productDb = require('../model/productModel');
const ObjectId = require('mongoose').Types.ObjectId;


exports.myProfile= async (userId) => {
    const user = await userDb.findOne({_id:userId})
    return user;
}
exports.profileEdit = async (userId,userDetails)=>{
    console.log(userDetails,'00000000usrerererer');
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
    console.log(user,'usrerererer');
    return user;
    
}
exports.updatePassword = async (body,userId) =>{
    await userDb.updateOne({_id:userId},{
        $set:{
            password:body.confirmPsw
        }
    })
}