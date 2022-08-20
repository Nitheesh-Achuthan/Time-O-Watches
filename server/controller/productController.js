let productDb = require('../model/productModel');
let productServices = require('../services/productService');
let cartServices = require('../services/cartService'); 



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

exports.editProduct = async (req,res)=>{

    const editPro = await productServices.editProducts(req.params.id);
    console.log(editPro,'###########################################################');
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

// exports.updatepage = async(req,res)=>{
//     console.log('aaaaaaaaaaaaaaa');
//     const product = await productDb.findOne({_id:req.query.id});
//     console.log(product);
//     res.render('admin/updateProduct',{watches:product})

// } 
