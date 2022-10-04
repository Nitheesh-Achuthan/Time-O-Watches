let userDb = require('../model/model');
let productDb = require('../model/productModel');
let orderDb = require('../model/orderModel');

// ----------------------Total Users ---------------------------//

exports.totalUsers = async ()=>{
    const users = await userDb.aggregate([
        {
            
            $project: {
                _id:0,
                isBlocked:1
            }
        }
    ])
    return users;
}

// -------------Total Producta---------------//

exports.totalProducts = async ()=>{
    const products = await productDb.find()
    return products;
}

// ------------Total Orders----------//

exports.totalOrders = async ()=>{
    const orders = await orderDb.aggregate([
        {
            $project: {
                _id:0, status:1 , paymentMethod:1
            }
        }
    ])
    
    return orders;
}    

// ---------Revenue---------------//

exports.revenueTotal = async ()=>{
    const totalRevenue = await orderDb.aggregate([
        {
            $match: {
                status: {$eq: 'Delivered'}
            }
        },
        {
            $project:{
                _id:0,
                totalAmount:1
            }
        }
    ])
    
    return totalRevenue;
};  