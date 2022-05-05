const express=require('express');
var router=express.Router();
const path=require('path');
router.use(express.json());
router.use(express.static('pages'));
router.use(express.urlencoded({extended:false}));
//mongodb requirement
var mongoose=require('./mongodb');
//schema requirement
var User=require('../schema/user');
var Vendor=require('../schema/vendor');
var Cart=require('../schema/cart');
const cart = require('../schema/cart');
router.get('/userlogin',(req,res)=>{
    res.sendFile(path.resolve('pages/userlogin.html'));
})
router.get('/userreg',(req,res)=>{
    res.sendFile(path.resolve('pages/userreg.html'));
});
router.get('/dashboard',(req,res)=>{
    res.sendFile(path.resolve('pages/userdashboard.html'));
})
router.get('/view',(req,res)=>{
    res.sendFile(path.resolve('pages/userview.html'));
});
router.get('/cart',(req,res)=>{
    res.sendFile(path.resolve('pages/usercart.html'));
})
//local variables 
var user_info;
var find_info;
var view_mail;
var paper_sent;
//user registration api
router.post('/userreg',(req,res)=>{
    var a=req.body.name;
    var b=req.body.email;
    var c=req.body.mobile;
    var d=req.body.city;
    var e=req.body.cpswd;
    var f=req.body.npswd;
    if(e==f)
    {
        User.findOne({email:b,mobile:c},(err,result)=>{
            if(err)
            {
                console.log(err);
            }
            else
            {
                if(result==null)
                {
                    User.create({
                        name:a,
                        email:b,
                        mobile:c,
                        city:d,
                        password:e
                    },(err)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            User.findOne({email:b,password:e},(err,result)=>{
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    user_info=result;
                                    res.send("true");
                                }
                            })
                        }
                    })
                }
                else
                {
                    res.send("invalid");
                }
            }
        })
    }
    else
    {
        res.send("doesntmatch");
    }
});
//user login api
router.post('/userlogin',(req,res)=>{
    var a =req.body.email;
    var b=req.body.password;
    User.findOne({email:a,password:b},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(result==null)
            {
                res.send("invalid");
            }
            else
            {
                user_info=result;
                res.send("true");
            }
        }
    })
});
router.get('/name',(req,res)=>{
    res.send(user_info.name);
});
router.post('/find',(req,res)=>{
    var a=req.body.city;
    Vendor.find({city:a},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            find_info=result;
            res.send(result);
        }
    })
});
router.get('/viewpaper/:id',(req,res)=>{
    var id=req.params.id;
    view_mail=find_info[id].email;
    res.redirect('/user/view');
});
router.post('/view',(req,res)=>{
    Vendor.findOne({email:view_mail},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            paper_sent=result;
            res.send(result);
        }
    })
});
router.post('/addtocart',(req,res)=>{
    var a=req.body.start;
    var b=req.body.end;
    var c=req.body.city;
    var d=req.body.noofdays;
    Cart.findOne({email:user_info.email,papername:paper_sent.papername},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(result==null)
            {
                Cart.create({
                    name:user_info.name,
                    email:user_info.email,
                    mobile:user_info.mobile,
                    city:c,
                    start:a,
                    end:b,
                    noofdays:d,
                    total:paper_sent.paperprice*d,
                    vemail:paper_sent.email,
                    papername:paper_sent.papername,
                    paperprice:paper_sent.paperprice,
                    image:paper_sent.image
                },(err)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.send("true");
                    }
                })
            }
            else
            {
                res.send("invalid");
            }
        }
    })
});
router.post('/cart',(req,res)=>{
    Cart.find({email:user_info.email},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            inside_cart=result; 
            res.send(result);
        }
    })
});
router.get('/removefromcart/:id',(req,res)=>{
    var id=req.params.id;
    Cart.deleteOne(inside_cart[id],(err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect('/user/cart')
        }
    })
})
module.exports=router;
