const cartDb = require('../model/cartModel');
const saveAddressDb = require('../model/saveAddressModel');
const saveAddressServices = require('../services/saveAddressService'); 
const cartServices = require('../services/cartService'); 

exports.addCart = async (req,res)=>{
    // req.session.productId=req.params.id
    // console.log(req.params.id,req.session.user._id,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkiykkkkkk');
    const addCart = await cartServices.addToCart(req.params.id,req.session.user._id); 
    res.json({status:true});
}
exports.cart = async (req,res)=>{
    let user = req.session.user;
    const products = await cartServices.cartView(req.session.user._id);
    // console.log(products,'lllllllllllllllllllllllllllllllllllllllll');
    let cartCount = await cartServices.count(req.session.user._id) 
    let totalValue = await cartServices.totalAmount(req.session.user._id)


    res.render('user/cart',{products,cartCount,user,totalValue});
}

exports.changeProductQuantity = async(req,res)=>{
   const changeProQty = await cartServices.changeQty(req.body);
    const total = await cartServices.totalAmount(req.body.user)  
    res.status(200).json({total,changeProQty});
}
 exports.removeProCart = async (req,res)=>{
    const removePro = await cartServices.removeProduct(req.body)
    res.json(removePro)
 }
exports.checkout = async(req,res)=>{
    let user = req.session.user;
    let cartCount = await cartServices.count(req.session.user._id)
    let total = await cartServices.totalAmount(req.session.user._id)
    let savedAddress = await saveAddressServices.addressSaved(req.session.user._id)
    res.render('user/checkout',{cartCount,user,total,savedAddress})
}
        