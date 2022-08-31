const express = require('express');
const adminRoute = express.Router();
const userDb = require('../model/model');
const productDb = require('../model/productModel');
const adminDb = require('../model/adminModel');
const controller = require('../controller/controller');
const productController = require('../controller/productController');
const orderController = require('../controller/orderController');
const dashboardController = require('../controller/dashboardController');
const categoryDb = require('../model/categoryModel');
const services = require('../services/categoryService')

adminRoute.get('/', (req, res) => {  
    if (req.session.isAdminLogin) {

        userDb.find()
            .then(data => {
                res.render('admin/tables', { users: data });
            })
    } else {
        res.render('admin/sign-in', { error: '' })
    };

});

// adminRoute.get('/tables',(req,res)=>{
//     res.redirect('/admin')
// })


// -------------- admin log out -------------//

adminRoute.get('/logout',(req,res)=>{
    req.session.isAdminLogin = false;
    req.session.admin = null;
    res.redirect('admin/sign-in')

})


// middleware///

adminRoute.use((req, res, next) => {
    if (req.query._method == "DELETE") {
        req.method = "DELETE";
        req.url = req.path;
    } else if (req.query._method == "PUT") {
        req.method = "PUT";
        req.url = req.path;
    }
    next();
});



adminRoute.post('/tables', controller.find);

adminRoute.patch("/:id", async (req, res) => {

    try {
        const user = await userDb.findById(req.params.id);

        if (user.isBlocked) {
            await userDb.updateOne({ _id: req.params.id }, { $set: { isBlocked: false } })

            const users = await userDb.find();

            // console.log('ddddddddddddddddddddddddddd', users);

            res.status(200).render('admin/tables', { users });

        } else {
            await userDb.updateOne({ _id: req.params.id }, { $set: { isBlocked: true } })
            const users = await userDb.find();
            res.status(200).render('admin/tables', { users });
        }

    }
    catch (error) {
        res.redirect('/admin/tables');
    }
});


adminRoute.get('/product',(req,res)=>{
    productDb.find()
    .then(data=>{
    
        res.render('admin/product-manage',{watches:data})
    })
    .catch(err=>{
        console.log(err.message);
    })

})

adminRoute.get('/addproduct',(req,res)=>{
    res.render('admin/addProduct')
     
   
})  

adminRoute.post('/product',productController.create);

adminRoute.get('/edit-product/:id',productController.editProduct);
adminRoute.post('/edit-product/:id',productController.updateProducts);

adminRoute.get('/delete-product/:id',productController.delete)

adminRoute.get('/category',(req,res)=>{
    categoryDb.find()
    .then(data=>{
        res.render('admin/category-manage',{ cate: data })
    }) 
    .catch(err=>{
        console.log(err.message);
    })
})

adminRoute.get('/addcategory',(req,res)=>{
    res.render('admin/add-category')
})

adminRoute.post('/category',controller.createcat);
adminRoute.get('/update',controller.updatepage);
adminRoute.put('/update/:id',controller.update);  
adminRoute.delete('/delete/:id',controller.delete);

//=== orders===//

adminRoute.get('/orderManagement',orderController.orders);

adminRoute.put('/cancel-order/:id', orderController.cancelOrder);

adminRoute.post('/statusUpdate',orderController.statusUpdate);

// ======Dashboard Admin side  =====//

adminRoute.get('/dashboard',dashboardController.dashboardDetails)
    

     
module.exports = adminRoute;              