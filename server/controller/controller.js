let userDb = require('../model/model');
let adminDb = require('../model/adminModel');
let categoryDb = require('../model/categoryModel');
let productDb = require('../model/productModel');
let services = require('../services/categoryService');
let cartServices = require('../services/cartService'); 
const bcrypt = require('bcrypt')


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

                    // console.log(data);     

                // console.log('jjjjjjj');        
                req.session.admin=req.body.email;
                req.session.isAdminLogin=true;
                res.render('admin/tables',{users:data})

                })  
                
            }else{

                // console.log('hhhhhhhhhh');
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
        const cate = services.addCate(req.body.name)
            res.redirect('/admin/category')
    };

    exports.updatepage = async(req,res)=>{
        console.log('aaaaaaaaaaaaaaa');
        const category = await categoryDb.findOne({_id:req.query.id});
        console.log(category);
        res.render('admin/update-category',{cate:category})

    } 

    exports.update = (req,res)=>{
        // console.log(req.params.id,'jjjjjjjjjjjjjjjjjjjjjjjjjjj',req.body.name);
     const catUpdate = services.updateCate(req.params.id,req.body.name);
    //  res.render('admin/category-manage',{cate:catUpdate})
    res.redirect('/admin/category')
    
    }
 
    exports.delete = (req,res)=>{ 
        // console.log('njaan compiler',req.params.id);
        const id = services.deleteCate(req.params.id);
        
            res.redirect('/admin/category')   
       
    }   
         