const offerServices = require('../services/offerService');
const productServices = require('../services/productService');
const offerDb = require('../model/offerModel');



exports.offers = async (req,res)=>{
    const offers = await offerServices.proOffer()
    // const products = await productServices.offerProduct(proId)
    // const offers = await offerServices.totalOffers()

    res.render('admin/offer',{offers})
}

exports.addOffer = async (req,res)=>{
    const product = await productServices.productOffer()
    res.render('admin/addOffer',{products:product})
}

exports.offerAdd = async (req,res)=>{
    const productOffer = {
        percentage:req.body.percent,
        proId:req.body.product,
        fromDate:req.body.fromDate,
        toDate:req.body.toDate
    }
    const proDetails = new offerDb(productOffer)
           await offerServices.offer(proDetails)
           res.redirect('/admin/offers')
}


 exports.status = async(req, res) =>{
        try {
            const offer = await offerDb.findById(req.params.id)
            console.log(offer,'oooofffffeeeeerrrrrrrrrr');
            if (offer.status){
                await offerDb.findByIdAndUpdate(req.params.id,{status:false})
            }else{
                await offerDb.findByIdAndUpdate(req.params.id,{status:true})
            }
            res.redirect('/admin/offers')
        }catch (err) {
            console.log(err);
            res.send(err.message);
        }
    }







