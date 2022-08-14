const cartDb = require('../model/cartModel');
const cartServices = require('../services/cartService'); 

exports.addCart = async (req,res)=>{
    // req.session.productId=req.params.id
    // console.log(req.params.id,req.session.user._id,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkiykkkkkk');
    const addCart = await cartServices.addToCart(req.params.id,req.session.user._id); 
    res.json({status:true});
}
exports.cart = async (req,res)=>{
    const products = await cartServices.cartView(req.session.user._id);
    // console.log(products,'lllllllllllllllllllllllllllllllllllllllll');
    let cartCount = await cartServices.count(req.session.user._id) 

    res.render('user/cart',{products,cartCount});
}

exports.changeProductQuantity = async(req,res,next)=>{
    let changeProQty = await cartServices.changeQty(req.body);
    res.json(changeProQty);
}
        