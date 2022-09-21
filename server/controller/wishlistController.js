const wishlistServices = require('../services/wishlistService');
const productServices = require('../services/productService');
const cartServices = require('../services/cartService'); 



exports.addToList = async(req,res)=>{
    const proId = req.params.id;
    const user  = req.session.user;
    const product = await wishlistServices.addToWishlist(proId,user)
};

exports.wishlistPage = async(req,res)=>{
    const userId = req.session.user._id;
    const products = await wishlistServices.wishlistPros(userId);
    let cartCount = await cartServices.count(userId);
    res.render('user/my-wishlist',{cartCount,products})
};

exports.removeWishlistProduct = async(req,res)=>{
    const proId = req.body.id;
    const userId = req.session.user._id;
     await wishlistServices.wishlistRemove(proId,userId);
    res.json(true);
};

