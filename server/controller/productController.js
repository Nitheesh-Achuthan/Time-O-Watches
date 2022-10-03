let productDb = require('../model/productModel');
let productServices = require('../services/productService');
let cartServices = require('../services/cartService'); 
let categoryServices = require('../services/categoryService');
const offerServices = require('../services/offerService');
const ObjectId = require('mongoose').Types.ObjectId;
let offerDb = require('../model/offerModel');






exports.create = (req,res)=>{
    let image = req.files.image
    let date = Date.now()
    let uploadPath = `./public/images/${date}.jpeg`
    let imgPath = `images/${date}.jpeg`
    // console.log(uploadPath,'imageeeeeeeeeeeeeeeeee');
    // console.log(imgPath);

    image.mv(uploadPath,(err)=>{
        console.log(uploadPath);  
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }
 
    // console.log(req.body);
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
    // console.log(editPro,'###########################################################');
      res.render('admin/updateProduct',{watches:editPro})
};
exports.updateProducts = async(req,res)=>{
    const updatePro = await productServices.updateProduct(req.params.id,req.body)
    // console.log(updatePro);
    res.redirect('/admin/product')

}

exports.delete = (req,res)=>{
    const proId = productServices.deleteProduct(req.params.id);

    res.redirect('/admin/product')

}

exports.proDetails = async (req,res)=>{
    try {
        const proId = req.params.id;
        let cartCount = await cartServices.count(req.session.user._id); 
        let proDetails = await productServices.productDetails(proId);
        let offerPro = await offerServices.offerProduct(proId);
    
        if(offerPro){
            let offer = await offerServices.productDetailsOffer(proId);
            res.render('user/product-detailsOffer',{watches:proDetails,cartCount,offer});
        }else{
            res.render('user/product-details',{watches:proDetails,cartCount,offer:''});
        }
    } catch (error) {
        console.log(error,'error 404-----------')
        res.render('error')
    }
   }


// exports.updatepage = async(req,res)=>{
//     console.log('aaaaaaaaaaaaaaa');
//     const product = await productDb.findOne({_id:req.query.id});
//     console.log(product);
//     res.render('admin/updateProduct',{watches:product})

// } 
