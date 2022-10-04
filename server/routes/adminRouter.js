const express = require('express');
const adminRoute = express.Router();
const userDb = require('../model/model');
const productDb = require('../model/productModel');
const adminDb = require('../model/adminModel');
const controller = require('../controller/controller');
const productController = require('../controller/productController');
const orderController = require('../controller/orderController');
const dashboardController = require('../controller/dashboardController');
const offerController = require('../controller/offerController');
const couponController = require('../controller/couponController');
const bannerController = require('../controller/bannerController');
const categoryDb = require('../model/categoryModel');

// ---admin signin---//
adminRoute.get('/',controller.adminSignIn)  

// adminRoute.get('/tables',controller.adminHome);


// -------------- admin log out -------------//

adminRoute.get('/logout',controller.adminLogout)


// middleware for query ///

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


// ----middleware for checking admin---//

adminRoute.use((req, res, next) => {
    if (!req.session.isAdminLogin) {
        res.redirect("/admin");
    } else next();
});




adminRoute.patch("/:id", async (req, res) => {

    try {
        const user = await userDb.findById(req.params.id);
        console.log(user,'iiii')

        if (user.isBlocked) {
            await userDb.updateOne({ _id: req.params.id }, { $set: { isBlocked: false } })

            const users = await userDb.find();


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

// --- for adding product admin side---- //
adminRoute.get('/addproduct',productController.addProduct)

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
        console.log(err);
    })
})

adminRoute.get('/addcategory',controller.showCategory);


adminRoute.post('/category',controller.createcat);
adminRoute.get('/update',controller.updatepage);
adminRoute.put('/update/:id',controller.update);  
adminRoute.delete('/delete/:id',controller.delete);

//=== orders===//

adminRoute.get('/orderManagement',orderController.orders);

adminRoute.put('/cancel-order/:id', orderController.cancelOrder);

adminRoute.post('/statusUpdate',orderController.statusUpdate);
// ---------------------
adminRoute.get('/orderproducts/:id',orderController.orderProducts)

// ======Dashboard Admin side  =====//

adminRoute.get('/dashboard',dashboardController.dashboardDetails);

// ========= offers ========== //
adminRoute.get('/offers',offerController.offers);

adminRoute.get('/add-offer',offerController.addOffer);

adminRoute.post('/offer-add',offerController.offerAdd);

adminRoute.patch('/offer-status/:id',offerController.status);

adminRoute.delete('/offer-delete/:id',offerController.offerDelete);

adminRoute.get('/update-offer/:id',offerController.editOffer);

adminRoute.put('/offer-update/:id',offerController.updateOffer);

// ============ Coupons ================//

adminRoute.get('/coupons',couponController.coupons);

adminRoute.get('/add-coupon',couponController.addCoupon);

adminRoute.post('/coupon-add',couponController.couponAdd);

adminRoute.patch('/coupon-status/:id',couponController.status);

adminRoute.delete('/coupon-delete/:id',couponController.couponDelete);

adminRoute.get('/update-coupon/:id',couponController.editCoupon);

adminRoute.put('/coupon-update/:id',couponController.updateCoupon);

adminRoute.get('/coupon-history',couponController.couponHistory);

// ----------------------------------------- pro details order-------------//

adminRoute.get('/product-orders',orderController.ordDetails);

// -------------- banner management-------- //

adminRoute.get('/banner-management',bannerController.showBanner);

adminRoute.get('/editbanner/:id',bannerController.editBanner);

adminRoute.post('/update-banner/:id',bannerController.updateBanner);    

     
module.exports = adminRoute;              