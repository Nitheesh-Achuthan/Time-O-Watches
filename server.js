const express = require('express');
const app = express();
const session = require('express-session');
const path= require('path');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const connectDB = require('./server/database/mongoConnection');
require('dotenv').config();

const port = process.env.PORT
     
app.set("view engine","ejs"); 
                                                          
// mongoose.connect(process.env.MONGO_URL,(err)=>{
//     if(err){  
//      console.log("Could not connect to database");  
//     }else{
//         console.log('mongodb connected successfully');    
//     }                
// });       
// ---mongodb connection----//
connectDB();
                 
// override the method in form   
app.use(methodOverride('_method'));

//log requests...........//                   
app.use(morgan('tiny'));

 //parse json bodies...//
app.use(express.json());    

app.use(express.urlencoded({extended:true})); 

app.use(fileUpload());
 
//..session handling....//
app.use(
    session({   
        secret: uuidv4(), 
        resave: false,         
        saveUninitialized: true,  
    }) 
);

// cache control///
app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  });
   
//static files
app.use('/assets',express.static(path.join(__dirname,"/public/assets")));
app.use('/adminAssets',express.static(path.join(__dirname,"/public/adminAssets")));
app.use('/admin/adminAssets',express.static(path.join(__dirname,"/public/adminAssets")));
app.use('/js',express.static(path.join(__dirname,"/public/js")));
app.use('/images',express.static(path.join(__dirname,"/public/images")));


  
app.use('/admin',require("./server/routes/adminRouter"));  
app.use('/',require("./server/routes/userRouter")); 

app.use((req,res,next)=>{
    res.status(404).render('error.ejs')
})
             
app.listen(port,()=>{          
    console.log(`http://localhost:${port}`);          
});         


