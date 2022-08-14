const cartServices = require('../services/cartService')
const orderDb = require('../model/orderModel')

exports.create = async(req,res)=>{

    const cartItems =  await cartServices.userCart(req.session.user._id)
    console.log(cartItems,'sssssssssssssssssssssssssssssssssssssssssssssssssssggggggggggggggggggggg');
    

    // console.log('8888888888888888888888888888', req.body);

    if (!req.body) {
        // console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');

        res.status(400).send({ message: "content cannot be empty" });

    } else {
        const deliveryDetails = {
                 firstName: req.body.fname,
                lastName: req.body.lname,
                mobile:req.body.number,
                email: req.body.email,
                country:req.body.country,
                address:req.body.address
               }
               console.log(deliveryDetails,'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');

               const userid = req.session.user._id
               console.log(userid,'uddddddddddddssssssssssssssssss');

               const cod = req.body.paymentmethod
               console.log(cod,'coooooooooooooooooooooooooooood');

               const date = Date.now()
               console.log(date,'daaaaaaaaaaaaaaaaattttttttteeeeeee');

               const status = "ordered";
               console.log(status,'staaaaaaaaaaaatus');

               const amount = 4444444

               const products = cartItems
               console.log(products,'prooooooooooooooooddddddddddddddddddddd');

               const order = new orderDb({
                 deliveryDetails:deliveryDetails,
                 userId:userid,
                 paymentMethod:cod,
                 date:date,
                 products:products,
                 totalAmount:amount,
                 status:status
               });
               await order.save()
               res.redirect('/') 
            //    console.log(product,'caaaaaaaaaarrrrrrrrrrrtttttt');
        // const order = new orderDb({
        //    deliveryDetails:{
        //      firstName: req.body.fname,
        //     lastName: req.body.lname,
        //     mobile:req.body.mobile,
        //     email: req.body.email,
        //     country:req.body.country,
        //     address:req.body.address
        //    }

        // });
        // console.log(order,'pppppppppppppppppppppppppppppppppppppppppppppppppp');
        // order.save()  
        //     .then(() => {
        //         res.redirect('/')
        //         // res.json({ user })
        //     })
        //     .catch(err => {
        //         console.log(err.message);
        //     })
    }
}
