let productDb = require('../model/productModel');
let productServices = require('../services/productService');
let cartServices = require('../services/cartService'); 
let categoryServices = require('../services/categoryService');
const offerServices = require('../services/offerService');






exports.create = (req,res)=>{
    let image = req.files.image
    let date = Date.now()
    let uploadPath = `./public/images/${date}.jpeg`
    let imgPath = `images/${date}.jpeg`
    

    image.mv(uploadPath,(err)=>{
        if(err){
            // console.log(err);
            return res.status(500).send(err);
        }
 
    const product = new productDb({
        name:req.body.name,
        price:req.body.price,
        quantity:req.body.quantity,
        category:req.body.category,
        description:req.body.description,
        image:imgPath
    });

    product.save()
    .then(()=>{
        
            res.redirect('/admin/product')
    })
    .catch(err=>{
        res.send(err.message);
    })  
      
    })
}

exports.addProduct = async(req,res)=>{
    const cate = await categoryServices.categorys()
    res.render('admin/addProduct',{cate})
}

exports.editProduct = async (req,res)=>{

    const editPro = await productServices.editProducts(req.params.id);
      res.render('admin/updateProduct',{watches:editPro})
};
exports.updateProducts = async(req,res)=>{
    const updatePro = await productServices.updateProduct(req.params.id,req.body)
    res.redirect('/admin/product')

}

exports.deleteProduct = (req,res)=>{
     productServices.deleteProduct(req.params.id);

    res.redirect('/admin/product')

}

exports.proDetails = async (req,res)=>{
    try {
        const proId = req.params.id;
        let cartCount = await cartServices.count(req.session.user._id); 
        let proDetails = await productServices.productDetails(proId);
        let offerPro = await offerServices.offerProduct(proId);
        let userlogIn = req.session.loggedIn;
        let user = req.session.user;
    
        if(offerPro){
            let offer = await offerServices.productDetailsOffer(proId);
            res.render('user/product-detailsOffer',{watches:proDetails,cartCount,offer,userlogIn,user});
        }else{
            res.render('user/product-details',{watches:proDetails,cartCount,offer:'',userlogIn,user});
        }
    } catch (error) {
        res.render('error')
    }
   }



