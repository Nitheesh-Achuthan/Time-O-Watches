const bannerDb = require('../model/bannerModel');

exports.banner = async () =>{
    const banner = await bannerDb.find();
    return banner;
};

exports.editbanner = async(bannerId)=>{
    const banner = await bannerDb.findOne({_id:bannerId});
    return banner;
};
