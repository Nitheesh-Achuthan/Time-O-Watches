const couponServices = require('../services/couponService');
const couponDb = require('../model/couponModel');


exports.coupons = async (req,res)=>{
    const coupons = await couponServices.couponOffer()
    res.render('admin/coupon',{coupons})
}; 

exports.addCoupon = async (req,res)=>{
    res.render('admin/addCoupon')
}

exports.couponAdd = async (req,res)=>{
    const couponOffer = {
        code:req.body.couponcode,
        percentage:req.body.percent,
        min:req.body.minprice,
        fromDate:req.body.fromDate,
        toDate:req.body.toDate
    }
    const couponDetails = new couponDb(couponOffer)
           await couponServices.couponAdd(couponDetails)
           res.redirect('/admin/coupons')
};

exports.status = async(req, res) =>{
    try {
        const coupon = await couponDb.findById(req.params.id)

        if (coupon.status){
            await couponDb.findByIdAndUpdate(req.params.id,{status:false})
        }else{
            await couponDb.findByIdAndUpdate(req.params.id,{status:true})
        }
        res.redirect('/admin/coupons')
    }catch (err) {
        console.log(err);
        res.send(err.message);
    }
};

exports.couponDelete = async(req,res)=>{
    try {
        await couponServices.deleteCoupon(req.params.id)
        res.redirect('/admin/coupons')
    } catch (err) {
        res.send(err.message);
    }
};

exports.editCoupon = async(req,res)=>{
    try {
        const coupon = await couponServices.couponEdit(req.params.id);
         res.render('admin/edit-coupon',{coupon})
    } catch (err) {
        res.send(err.message);

    }
};

exports.updateCoupon = async(req,res)=>{
    const couponId = req.params.id;
    const couponObj = {
        code:req.body.couponcode,
        percentage:req.body.percent,
        min:req.body.minprice,
        fromDate:req.body.fromDate,
        toDate:req.body.toDate
    }
    await couponServices.couponUpdate(couponId,couponObj);
    res.redirect('/admin/coupons')
};

exports.couponHistory = async(req,res)=>{
    const history = await couponServices.couponHistory();
    res.render('admin/coupon-history',{history})
}


// ----------- user side ------//

exports.applyCoupon = async (req,res)=>{
    try {
        const code = req.params.coupon;
    const total = parseInt(req.params.total);
    const user = req.session.user._id;
    const couponOffer = await couponServices.couponDiscount(code,total)

    if(couponOffer) {
        const nowDate = new Date();
        const usedCoupons = await couponServices.couponUsed(user,code)

        if(usedCoupons) {
            res.json({error:'Already used'})
        }
         else if(nowDate.getTime() > couponOffer.toDate.getTime()) {
            res.json({ error: 'Coupon is expired' })
        }
         else if(couponOffer.min < total) {
            discountPrice = (total * couponOffer.percentage) / 100;
            const couponPrice = parseInt(total-discountPrice);
            const usedCouponObj = {
                user:user,
                coupon:code,
                date: new Date(),
                discount: discountPrice
            }

            await couponServices.coupon(usedCouponObj)
            res.json({ couponPrice, discountPrice })
         } else {
            res.json({ error: `Minimum Rs. ${couponOffer.min} spend` })
         }
        } else{
            res.json({ error: 'Coupon not found' })
        }
    } catch (error) {
        res.render('error')
    }   
                  
    };
