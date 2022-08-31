
const dashboardServices = require('../services/dashboardService');

exports.dashboardDetails = async (req,res)=>{
    
 const allUsers = await dashboardServices.totalUsers()
 console.log(allUsers,'-----');
 let users = allUsers.length;

 let blockedCount = 0;
 let activeCount = 0;
 for(const user of allUsers){
     user.isBlocked ? blockedCount++ : activeCount++
 }
 console.log(users,'+++++++ooo') 
 console.log(blockedCount,activeCount,'+++++++ooo') 

 //-------------------------------------------------------//
 
 const allProducts = await dashboardServices.totalProducts()
 let products = allProducts.length;
 console.log(products,'-----pppppppppprrrrrrrrrrrrrrooooooooooooo');


 //-------------------------------------------------------//
 
 const allOrders = await dashboardServices.totalOrders()
 let orders = allOrders.length;
 console.log(orders,'+++++++++++++++');
 
 let orderedCount = 0;
 let shipedCount = 0;
 let deliveredCount = 0;
 let canceledCount = 0;  
 let onlineCount =0;
 let codCount = 0;
 
 
 for (let payment of allOrders){
     payment.paymentMethod === 'Online' ? onlineCount++ : codCount++
    }
    
    for (let order of allOrders){
        order.status === 'Canceled' ? canceledCount++ : order.status === 'Ordered' ? orderedCount++ : order.status === 'Delivered' ? deliveredCount++ : order.status === 'Shiped' ? shipedCount++ : ""
    }
    
    
    console.log(orderedCount,shipedCount,deliveredCount,canceledCount,'+++++++ooo',onlineCount,codCount) 
     console.log(allOrders,'-----');
     
//-------------------------------------------------------//
     
const revenue = await dashboardServices.revenueTotal()
     //  console.log(revenue,'-----');
 let totalRevenue = 0;
    for (const total of revenue){
        totalRevenue += total.totalAmount   
        console.log(totalRevenue,'======');
    }
    // console.log(totalRevenue,'======++++++++++++');
 res.render('admin/dashboard',{users,products,blockedCount,activeCount,orderedCount,shipedCount,deliveredCount,canceledCount,onlineCount,codCount,orders,totalRevenue})
}               