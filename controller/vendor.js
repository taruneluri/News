const express=require('express');
const mongoose=require('./mongodb');
var router=express.Router();
router.use(express.static('pages'));
router.use(express.json());
router.use(express.urlencoded({extended:false}));
var path=require('path');
//schema requirements
var Vendor=require('../schema/vendor');
var Order=require('../schema/order');
//local variables
var vendor_info;
var order_result;
router.get('/vendorlogin',(req,res)=>{
    res.sendFile(path.resolve('pages/vendorlogin.html'));
});
router.get('/vendorreg',(req,res)=>{
    res.sendFile(path.resolve('pages/vendorreg.html'));
});
router.get('/dashboard',(req,res)=>{
    res.sendFile(path.resolve('pages/vendordashboard.html'));
})
router.get('/orders',(req,res)=>{
    res.sendFile(path.resolve('pages/vendororders.html'));
})
// REST api
router.post('/vendorreg',(req,res)=>{
    var a=req.body.name;
    var b=req.body.email;
    var c=req.body.mobile;
    var d=req.body.city;
    var e=req.body.papername;
    var f=req.body.paperprice;
    var g=req.body.units;
    var h=req.body.cpswd;
    var i=req.body.npswd;
    var j=req.body.image;
    Vendor.findOne({email:b,papername:e},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            if(result==null)
            {
                Vendor.create({
                    name:a,
                    email:b,
                    mobile:c,
                    city:d,
                    papername:e,
                    paperprice:f,
                    units:g,
                    password:h,
                    image:j
                },(err)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        Vendor.findOne({email:b,password:i},(err,result)=>{
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                vendor_info=result;
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
})
router.post('/login',(req,res)=>{
    var a=req.body.email;
    var b=req.body.password;
    Vendor.findOne({email:a,password:b},(err,result)=>{
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
                vendor_info=result;
                res.send("true");
            }
        }
    })
})
router.get('/profile',(req,res)=>{
    res.send(vendor_info.name);
})
router.post('/order',(req,res)=>{
    Order.find({vemail:vendor_info.email},(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            order_result=result;
            res.send(result);
        }
    })
})
module.exports=router;

