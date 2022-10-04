const bannerServices = require('../services/bannerServices');
const productServices = require('../services/productService');
const bannerDb = require('../model/bannerModel');

exports.showBanner = async (req,res)=>{
    // const banner = await bannerDb.find();
    const banner = await bannerServices.banner()
    res.render('admin/banner-management',{banner})
};

exports.editBanner = async(req,res)=>{
    const banner = await bannerServices.editbanner(req.params.id);
    const product = await productServices.productOffer();
    res.render('admin/edit-banner',{product,banner})
};

exports.updateBanner = async(req,res)=>{
  let imge = req.files.image;
  if(imge) {
      let date = Date.now();
    let uploadPath = `./public/images/${date}.jpeg`
    var imgPath = `images/${date}.jpeg`
    imge.mv(uploadPath,(err)=>{})
  }
  const id = req.params.id
  const banner = {
    name: req.body.name,
    description:req.body.description,
    proId:req.body.product,
    image:imgPath
  }  
  const update = await bannerDb.updateOne({_id:id},{ $set: banner})
  res.redirect('/admin/banner-management')
};