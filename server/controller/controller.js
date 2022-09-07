let userDb = require('../model/model');
let adminDb = require('../model/adminModel');
let categoryDb = require('../model/categoryModel');
let productDb = require('../model/productModel');
let categoryServices = require('../services/categoryService');
let cartServices = require('../services/cartService'); 
let userServices = require('../services/userServices')
const bcrypt = require('bcrypt')



// exports.landing = async (req,res)=>{
//     let product = await productDb.find()
//     res.render('user/landing-page',{ watches:product})
// }


exports.Create = (req, res) => {

    // console.log('8888888888888888888888888888', req.body);

    if (!req.body) {
        // console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');

        res.status(400).send({ message: "content cannot be empty" });

    } else {
        const user = new userDb({
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
            mobile:req.body.mobile,
            password: req.body.password             
        });
        console.log(user);
        user.save()  
            .then(() => {
                // res.redirect('/')
                res.json({ user })
            })
            .catch(err => {
                console.log(err.message);
            })
    }
}

exports.logg =async (req,res)=>{
    let cartCount = await cartServices.count(req.session.user._id) 
    const product = await productDb.find()
    res.render('user/home',{ watches:product,cartCount})
}

exports.Find = async (req, res) => {    
    const user = await userDb.findOne({ email: req.body.email, password: req.body.password });    
    if (user) {
          req.session.loggedIn=true
          req.session.user = user   
        
        if(user.isBlocked){
            res.render('user/login',{error:"You are suspended for a while"})
        }else{            
            res.redirect('/home')
        }
       

    } else {
        res.render('user/login', { error: "Invalid Username or Password" })
    }
}  


//admin//

exports.find = async (req,res) => {
     const admin = await adminDb.findOne({ email: req.body.email, password: req.body.password });
       console.log(admin);
    
            if (admin) {

                userDb.find() 
                .then(data=>{

                req.session.isAdminLogin=true;
                req.session.admin=admin;
                res.render('admin/tables',{users:data})

                })  
                
            }else{

                res.render('admin/sign-in')
            }
        
    }


    // exports.createcat = (req,res)=>{
    //     const cate = new categoryDb({
    //         name:req.body.name
    //     });

    //     console.log(cate,'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');
    //     cate.save()
    //     .then(()=>{
    //         res.redirect('/admin/category')
    //     })

    // };                    

    
    exports.createcat = (req,res)=>{
        const cate = categoryServices.addCate(req.body.name)
            res.redirect('/admin/category')
    };

    exports.updatepage = async(req,res)=>{
        // console.log('aaaaaaaaaaaaaaa');
        const category = await categoryDb.findOne({_id:req.query.id});
        console.log(category);
        res.render('admin/update-category',{cate:category})

    } 

    exports.update = (req,res)=>{
        // console.log(req.params.id,'jjjjjjjjjjjjjjjjjjjjjjjjjjj',req.body.name);
     const catUpdate = categoryServices.updateCate(req.params.id,req.body.name);
    //  res.render('admin/category-manage',{cate:catUpdate})
    res.redirect('/admin/category')
    
    }
 
    exports.delete = (req,res)=>{ 
        const id = categoryServices.deleteCate(req.params.id);
        
            res.redirect('/admin/category')   
       
    }   

    // ---------my account----------//

    exports.myAccount = async (req,res)=>{
        const user = await userServices.myProfile(req.session.user._id) 
        let cartCount = await cartServices.count(req.session.user._id)
        res.render('user/my-account',{user,cartCount})
    }
         
    exports.profileEdit = async (req,res)=>{
        console.log(req.body,'-------------------------------------')
        let cartCount = await cartServices.count(req.session.user._id)
        await userServices.profileEdit(req.session.user._id,req.body)
        res.redirect('/my-account')
    }
    exports.changePswd = async (req,res)=>{       
        let cartCount = await cartServices.count(req.session.user._id)
        res.render('user/profilePaswdChange',{cartCount,passworderror:""})
    }
    
    exports.newPassword = async (req,res)=>{
        // console.log(req.body,'newpsed++++++')
        const user = await userServices.passwordChange(req.body,req.session.user._id)
        if(user){
            
            if(req.body.newPswd==req.body.confirmPswd){
                await userServices.updatePassword(req.body,req.session.user._id)
                res.redirect('/')
            }else{
                req.session.passwordError = "Password doesn't match"
                res.redirect('/pswdChangeErr')
            }
        }else{
            req.session.passwordError = "Your Old Password Is wrong"
            res.redirect('/pswdChangeErr')
        }

    }
    exports.passwordChangeErr = async (req,res)=>{
            const user = req.session.user;
            const passworderror = req.session.passwordError;
            req.session.passwordError = null;
            res.render('user/profilePaswdChange', { user, error: "", passworderror });
               
    }