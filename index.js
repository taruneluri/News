const express=require('express');
const app=express();
app.use(express.static('pages'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
//requirements
var user=require('./controller/user');
var vendor=require('./controller/vendor');
//getting html pages
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/pages/index.html');
});
app.use("/user",user);
app.use('/vendor',vendor);
app.listen(3000,()=>{console.log('server started !')});