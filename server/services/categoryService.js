let categoryDb = require('../model/categoryModel');

exports.addCate = async (name)=>{
    let catExist = await categoryDb.findOne({name:name});
    return catExist
};  

exports.categorySave= async(name)=>{
    const category = new categoryDb({name:name})
    category.save()
};
            

exports.updateCate = async (id,newName) => {
    const udt = await categoryDb.updateOne({_id:id},{$set:{name:newName} })
}

exports.deleteCate = async (id)=>{
    const dlt= await categoryDb.findByIdAndDelete(id)
    // console.log(dlt,'Deletinggg');
    // return;
} 
// --- for finding categorys for product add page--//
exports.categorys = async ()=>{
    const cate = await categoryDb.find()
    return cate;
}