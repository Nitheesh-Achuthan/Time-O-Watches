const bannerServices = require('../services/bannerServices');
const productServices = require('../services/productService');
const bannerDb = require('../model/bannerModel');

exports.showBanner = async (req,res)=>{
    const banner = await bannerDb.find();
    console.log(banner,'______________________----------')
    res.render('admin/banner-management',{banner})
};

exports.editBanner = async(req,res)=>{
    const banner = await bannerDb.findOne({_id:req.params.id});
    const product = await productServices.productOffer();

    res.render('admin/edit-banner',{product,banner})
};

exports.updateBanner = async(req,res)=>{
  console.log(req.body,'--------banner');
//   let image = req.body.image;
  let imge = req.files.image;
  console.log('------======0000=====-----',imge);
  if(imge) {
      let date = Date.now();
    let uploadPath = `./public/images/${date}.jpeg`
    var imgPath = `images/${date}.jpeg`
    imge.mv(uploadPath,(err)=>{})
  }
  const id = req.params.id
  console.log(id,'ooooooooo')
  const banner = {
    name: req.body.name,
    description:req.body.description,
    proId:req.body.product,
    image:imgPath
  }  
  const update = await bannerDb.updateOne({_id:id},{ $set: banner})
  res.redirect('/admin/banner-management')
};