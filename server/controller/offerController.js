const offerServices = require('../services/offerService');
const productServices = require('../services/productService');
const offerDb = require('../model/offerModel');
let productDb = require('../model/productModel');
let cartServices = require('../services/cartService'); 


exports.offers = async (req,res)=>{
    const offers = await offerServices.proOffer();
    res.render('admin/offer',{offers})
}

exports.addOffer = async (req,res)=>{
    const product = await productServices.productOffer();
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
    };

    exports.offerDelete = async(req,res)=>{
        try {
            await offerServices.deleteOffer(req.params.id)
            res.redirect('/admin/offers')
        } catch (err) {
            res.send(err.message);
        }
    };
    exports.editOffer = async(req,res)=>{
        try {
            const product = await productServices.products();
            const offer = await offerServices.prodOffer(req.params.id);
             res.render('admin/edit-offer',{offer,product})
        } catch (err) {
            res.send(err.message);

        }
    };


    exports.updateOffer = async(req,res)=>{
        const offerId = req.params.id;
        const offerObj = {
            percentage:req.body.percent,
            proId:req.body.product,
            fromDate:req.body.fromDate,
            toDate:req.body.toDate
        }
        await offerServices.offerUpdate(offerId,offerObj);
        res.redirect('/admin/offers')
    };


// ---------------------offer user side-----------------------//

exports.offerHome = async(req,res)=>{
   
    const offer = await offerDb.aggregate([
        {
            $match: {
                status: true
            }
        },
        {
            $lookup:{
                from:'productDb',
                localField:'proId',
                foreignField:'_id',
                as:'proDetail'
            }
        },
        {
            $unwind:'$proDetail'
        },
        {
            $project:{
                id:'$proDetail._id',
                price:'$proDetail.price',
                products:'$proDetail',
                percentage:'$percentage',
                offerPrice: {$subtract: ['$proDetail.price',{$divide: [{ $multiply: ['$proDetail.price','$percentage']},100]}]}
            }
        }
    ])
    
    let cartCount = await cartServices.count(req.session.user._id) 
    const product = await productDb.find()
    res.render('user/offers',{ watches:product,cartCount,offer})
    return offer;
}


