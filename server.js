const express = require('express');
const app = express();
const session = require('express-session');
const path= require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const imageZoom = require('js-image-zoom');

app.set("view engine","ejs");

mongoose.connect('mongodb://localhost:27017/watch',(err)=>{
    if(err){
        console.log("Could not connect to database");
    }            
});                
                
// override the method in form 
app.use(methodOverride('_method')); 
                
app.use(morgan('tiny'));    

app.use(express.json()); 
    
app.use(express.urlencoded({extended:true})); 
app.use(fileUpload());

// app.use(     
//     session({secret: "Key",cookie:{maxAge:600000}}))   
 
app.use(
    session({   
        secret: uuidv4(), 
        resave: false, 
        saveUninitialized: true,  
    })
);
   
//static files
app.use('/assets',express.static(path.join(__dirname,"/public/assets")));
app.use('/adminAssets',express.static(path.join(__dirname,"/public/adminAssets")));
app.use('/admin/adminAssets',express.static(path.join(__dirname,"/public/adminAssets")));
app.use('/js',express.static(path.join(__dirname,"/public/js")));
app.use('/images',express.static(path.join(__dirname,"/public/images")));


var options1 = {
    width: 400,
    zoomWidth: 500,
    offset: {vertical: 0, horizontal: 10}
};

// If the width and height of the image are not known or to adjust the image to the container of it
var options2 = {
    fillContainer: true,
    offset: {vertical: 0, horizontal: 10}
};


  
app.use('/admin',require("./server/routes/adminRouter"));
app.use('/',require("./server/routes/userRouter")); 
             
app.listen(9000,()=>{   
    console.log('http://localhost:9000');         
});                                               