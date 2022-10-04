let userDb = require('../model/model');
let adminDb = require('../model/adminModel');
let categoryDb = require('../model/categoryModel');
let productDb = require('../model/productModel');
let bannerDb = require('../model/bannerModel')

let categoryServices = require('../services/categoryService');
let offerServices = require('../services/offerService');
let cartServices = require('../services/cartService'); 
let userServices = require('../services/userServices');

const bcrypt = require('bcrypt')



// exports.landing = async (req,res)=>{
//     const product = await productDb.find();
//     const offer = await offerServices.offers();
//     const banner = await bannerDb.find();
//     req.session.loggedIn=false

//     res.render('landing-page',{ watches:product,offer,banner,userlogIn:req.session.loggedIn})
// }
// ---- user login-----//
exports.userLogIn = (req,res)=>{
    
    if(req.session.loggedIn){
        
        res.redirect('/home')
    }else
    res.render('user/login',{error:''});
};

// ---- user sign up---//
exports.userSignUp = (req,res)=>{
    res.render('user/signup');   
};

exports.logInError = (req,res) =>{
    const error = req.session.error;
    req.session.error = null;
    res.render('user/login',{error:error})
}


exports.Create = async (req, res) => {

    if (!req.body) {
        res.status(400).send({ message: "content cannot be empty" });
    } else {
        const userObj = {
            firstName: req.body.fname,
            lastName: req.body.lname,
            email: req.body.email,
            mobile:req.body.mobile,
            password: req.body.password             
        }
        const user = await userServices.saveUser(userObj);      
        user.save()  
            .then(() => {
                res.json({ user })
            })
            .catch(err => {
                console.log(err.message);
            })
    }
};
// ---- home page user ------//
exports.logg =async (req,res)=>{

    const product = await productDb.find();
    const offer = await offerServices.offers();
    const banner = await bannerDb.find();

    if(req.session.loggedIn) {
    const user = req.session.user
    
    let cartCount = await cartServices.count(req.session.user._id); 
    // const wishlist = await wishlistServices.favourites(req.session.user._id);//////// wishlist color change function
    res.render('user/home',{ watches:product,cartCount,offer,banner,user,userlogIn:req.session.loggedIn})
    } else {
    req.session.loggeIn = false;
    res.render('user/home',{ watches:product,offer,banner,userlogIn:req.session.loggedIn})
    }
}
// --- user login ----
exports.Find = async (req, res) => { 
    const email = req.body.email;
    const password = req.body.password;
    const user = await userServices.getUser(email,password);   
    if (user) {
          req.session.loggedIn=true
          req.session.user = user   
        
        if(user.isBlocked){
            req.session.error = "You are suspended for a while";
            res.redirect('/loginError');
        }else{            
            res.redirect('/home')
        }            

    } else { 
        req.session.error = "Invalid Username or Password";
        res.redirect('/loginError');
    }
};  

    // ---------my account----------//

    exports.myAccount = async (req,res)=>{
        const user = await userServices.myProfile(req.session.user._id) 
        let cartCount = await cartServices.count(req.session.user._id)
        res.render('user/my-account',{user,cartCount,userlogIn:req.session.loggedIn})
    }
         
    exports.profileEdit = async (req,res)=>{
        let cartCount = await cartServices.count(req.session.user._id)
        await userServices.profileEdit(req.session.user._id,req.body)
        res.redirect('/my-account')
    }
    exports.changePswd = async (req,res)=>{       
        let cartCount = await cartServices.count(req.session.user._id)
        res.render('user/profilePaswdChange',{cartCount,passworderror:"",user:req.session.user,userlogIn:req.session.loggedIn})
    }
    
    exports.newPassword = async (req,res)=>{
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
           let cartCount = await cartServices.count(req.session.user._id)
            const user = req.session.user;
            const passworderror = req.session.passwordError;
            req.session.passwordError = null;
            res.render('user/profilePaswdChange', { cartCount,user, error: "", passworderror,userlogIn:req.session.loggedIn });
               
    };

    // ---- user logout---//
    exports.logOut = (req,res)=>{
        req.session.loggedIn = false;
        req.session.user = null;
        res.redirect('/') 
    };

    //-------- Admin Side ------//

exports.adminSignIn = async (req, res) => {  
    if (req.session.isAdminLogin) {
     await userDb.find()
               .then(data => {
                res.render('admin/tables', { users: data });
            })
    } else {
        res.render('admin/sign-in', { error: '' })
    }
};
// -- admin home --//
// exports.adminHome = (req,res)=>{
//     res.redirect('/admin') 
// };

// -- admin login---//
exports.find = async (req,res) => {
    const admin = await adminDb.findOne({ email: req.body.email, password: req.body.password });   
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
   };


    
   exports.showCategory = async (req,res)=>{
           cateError = req.session.error;
           req.session.error = null;
           res.render('admin/add-category',{cateError})        
   };                 

   
   exports.createcat = async (req,res)=>{
       try {
           const cate = await categoryServices.addCate(req.body.name)
       if(cate) {
           req.session.error = 'This category is already exist!!!'
           res.redirect('/admin/addcategory')
       } else{
           await categoryServices.categorySave(req.body.name)
           
           res.redirect('/admin/category')
       }
       } catch (error) {
           console.log(error);
       }
   };

   exports.updatepage = async(req,res)=>{
       const category = await categoryDb.findOne({_id:req.query.id});
       res.render('admin/update-category',{cate:category})

   } 

   exports.updateCategory = (req,res)=>{
    categoryServices.updateCate(req.params.id,req.body.name);
   res.redirect('/admin/category')
   
   }

   exports.deleteCategory = (req,res)=>{ 
        categoryServices.deleteCate(req.params.id);
       
           res.redirect('/admin/category')   
      
   };   

//    ---- admin logoUt ---//
exports.adminLogout = (req,res)=>{
    req.session.isAdminLogin = false;
    req.session.admin = null;
    res.redirect('/admin')
}; 