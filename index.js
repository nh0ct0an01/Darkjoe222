var express = require('express');
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));
app.listen(3000);
//Khai bao password
var session = require('express-session')
var async = require('async');
//Models
var DSKH = require("./Models/dbmongo");
var DSThe = require("./Models/dbcard");
var bcrypt = require('bcrypt');
var User = require('./Models/User');
var Pos = require('./Models/Pos');


//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("lol");
      if (file.fieldname === "ImageCMND1") { // if uploading resume
        cb(null, 'public/upload');
      } else { // else uploading image
        cb(null, 'public/upload');
      }
    },
    filename: function (req, file, cb) {
      console.log("cc");
      cb(null, Date.now()  + "-" + file.originalname)
      console.log("ho")
    }
});  
var storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()  + "-" + file.originalname)
  }
}); 
// upload file anh
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log("lol mia");
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png"|| file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" ){
            cb(null, true)
            console.log("haha");
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
});
var upload2 = multer({ 
  storage: storage2,
  fileFilter: function (req, file, cb) {
      console.log("lol mia");
      if(file.mimetype=="image/bmp" || file.mimetype=="image/png"|| file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" ){
          cb(null, true)
          console.log("haha");
      }else{
          return cb(new Error('Only image are allowed!'))
      }
  }
});

var up1 = upload.fields([{ name: 'ImageCMND1', maxCount: 1 }, { name: 'ImageCMND2', maxCount: 1 }]);
var up2 = upload2.single("cmndimage");

//Connect Mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dbtoanprodx1:Tu7121993@@cluster0.ldiid.mongodb.net/Test1?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false }, function(err)
    {
        if(err){
            console.log("Mongo connect error: " + err);
        }else{
            console.log("mongo connected successfull.");
        }
    }
);
function formatDatez(date,datett) {
  let ts = Date.now();
  let date_ob = new Date(ts);
  month = '' + (date_ob.getMonth() + 1),
  day = '' + date_ob.getDate(),
  year = date_ob.getFullYear();

  if (month == 1 || month == 3  || month == 5|| month == 7 || month == 8 || month == 10 || month == 12)
  {

    var t = Number(date) + Number(datett);
    var m = Number(month);
    var y = Number(year);
    if (t > 31){m = m + 1; t = t - 31}
    if (m > 12){m = 1; y = y + 1;}
  }else{ if(month ==2){
    var t = Number(date) + Number(datett);
    var m = Number(month);
    var y = Number(year);
    if (t > 29){m = m + 1; t = t - 30}
  }else{
    var t = Number(date) + Number(datett);
    var m = Number(month);
    var y = Number(year);
    if (t > 30){m = m + 1; t = t - 30}
   }
  } 

return [t, m, y].join('-');
}
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month, year].join('-');
}

// body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    
  }));

app.get("/", function(req, res){
    res.render("daohan_login",{query: req.query});
});
//Dang nhap
app.get("/Login", function(req, res){
    res.render("daohan_login",{query: req.query});
});
app.get("/Dangky", function(req, res){
    res.render("Dangky",{query: req.query});
});
app.get("/ResetMK", function(req, res){
    res.render("Home");
});
// Dang xuat
function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    console.log('Dont have session');
    res.redirect('/Login?failsess=6');
  }
}
app.get("/DoiMK", function(req, res){
  res.render("DoiMK",{query: req.query});
});
app.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

//Trang chu
app.get("/Admin", requiresLogin, function(req, res, next){
   
            DSKH.count(function(err, data){
                if(err)
                {}
                else{
                    console.log(data);
                    res.render("Admin",{coun:data});
                }
            })
        
   
});

// Get Danh Sach
app.get('/Khachhang' ,requiresLogin, (req , res, next)=>{
  console.log(req.session.userId);

      var dsuser = User.aggregate([{
        $lookup:{
            from: "dskhs",
            localField: "Khachhang",
            foreignField: "_id",
            as:"DSKH"
        }
    }], function(err, pris){
    
        pris.forEach(function(dsuser){                      
                    if(dsuser._id ==  req.session.userId){
                        res.render("Khachhang",{ danhsachKH:dsuser,query: req.query})
                    }
                   
                })
            
        })
    });
 

 



// Thong tin the
app.get('/Card/:id' ,requiresLogin, (req , res)=>{
  // current timestamp in milliseconds
  

  var dskhach = DSKH.aggregate([{
      $lookup:{
          from: "dsthes",
          localField: "Card",
          foreignField: "_id",
          as:"DSTHE"
      }
  }], function(err, pris){
    
      pris.forEach(function(dskh){ 
                         
                  if(dskh._id ==  req.params.id){
                      

                      res.render("Card",{ danhsachthe:dskh,query: req.query})
                  }
                 
              })
          
      })
 
  })
 //Dao han
app.get('/DaoHan' , requiresLogin, (req , res)=>{
  DSKH.find(function(err, data){
      if(err){
          console.log("an cut roi")
      }else{
          
          res.render("DaoHan",{ danhsachKH:data})
      }
  });


})




// Xu li Button
app.post('/addnew' , (req , res)=>{
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [day, month, year].join('-');
    }
   
  
      up1(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading." + err); 
           console.log(req.file);
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
        }else{
            console.log("Upload is okay");
         
          
            if(req.body.txtNameKh &&
              req.body.txtEmailKH &&
              req.body.txtSDTKH&&
              req.body.txtCMND&&
              req.body.txtBankName&&
              req.body.txtSTKH&&
              req.body.txtDateSK&&
              req.body.txtHanMuc
           ){     
            var dskh =DSKH({
                
            NameKh: req.body.txtNameKh,
            EmailKH: req.body.txtEmailKH,
            SDTKH: req.body.txtSDTKH,
            SCMND: req.body.txtCMND,
            CMNDimage1:  req.body.txtCMND,
          
            Card: [],
            
        });
        
        var dscard =DSThe({            
            BankName:  req.body.txtBankName,
            STKH: req.body.txtSTKH,
            DateSK: req.body.txtDateSK,
            DateTT: req.body.txtDateTT,
            HanMuc: req.body.txtHanMuc,
            DateTan: formatDatez(req.body.txtDateSK,req.body.txtDateTT),
            });
            console.log(formatDatez(req.body.txtDateSK,req.body.txtDateTT));
            dscard.save(function(err){});
            
            dskh.save(function(err,data){
              if(err){
                console.log(err)
              }else{

                  console.log("ok baby")
                  User.findOneAndUpdate({_id:req.session.userId}, {$push: {Khachhang:data._id}},function(err, datas){
                    if(err){
                        console.log("chen the an cut roi")
                        res.redirect("Khachhang?failaddnew=1");
                    }else{
                      DSKH.findOneAndUpdate({_id:data._id}, {$push: {Card:dscard._id}},function(err, dataz){
                        if(err){
                            console.log("chen the an cut roi")
                            res.redirect("Khachhang?failaddnew=1");
                        }else{
                          
                            res.redirect("Khachhang?addsuccess=1");
                        }
                    })
                        
                    }
                  })
                 
              }
          })}
          else{
            console.log("thieu 1 muc");
            res.redirect('/Khachhang?failmuc=1');
             }               
              }
           })    
   
  

    
   
    })








app.post('/Card' , (req , res)=>{ 
    
  up2(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log("A Multer error occurred when uploading."); 
    } else if (err) {
      console.log("An unknown error occurred when uploading." + err);
    }else{
        console.log("Upload is okay");
        console.log(req.body.txtBankName); // Thông tin file đã upload
        if(req.body.txtBankName &&
          req.body.txtSTKH &&
          req.body.txtDateSK&&
          req.body.txtDateTT&&
          req.body.txtHanMuc
        ){
          var dscard =DSThe({            
          BankName:  req.body.txtBankName,
          STKH: req.body.txtSTKH,
          DateSK: req.body.txtDateSK,
          DateTT: req.body.txtDateTT,
          HanMuc: req.body.txtHanMuc,
          DateTan: formatDatez(req.body.txtDateSK,req.body.txtDateTT),
      });
          dscard.save(function(err){
            if(err){
                console.log("luu the an cut roi")
            }else{
                DSKH.findOneAndUpdate({_id:req.body.slcID}, {$push: {Card:dscard._id}},function(err, data){
                    if(err){
                        console.log("chen the an cut roi")
                    }else{
                        res.redirect('/Card/'+req.body.slcID+'?addsuccess=10');
                    }
                })
            }
        })     
          }else{
            res.redirect('/Card/'+ req.body.slcID+'?failmuc=20');
         
          }
    }

});
  
    
    
    })







//Nut Dang Nhap Dang ky
app.post('/Dangky',(function (req, res, next){
    if (req.body.Password !== req.body.Passwordror) {
        var err = new Error('Mật khẩu không trùng! ');
        console.log('Mật khẩu không trùng');
        res.redirect('/Dangky?failpasswordcor=12');

      }
    else{
    if (
        req.body.txtusername &&
        req.body.Password &&
        req.body.Passwordror) {
        async.parallel([
            function(callback) {
              User.findOne({username: req.body.txtusername}, "username", function(err, user) {
                if (!err && user) callback(null, true);
                else callback(null, false);
              });
            },
            function(callback) {
              User.findOne({username: req.body.txtusername}, "username", function(err, user) {
                if (!err && user) callback(null, true);
                else callback(null, false);
              });
            },
          ], function(err, result) {
            if (!result[0]) {

           
              // Create user
         

    
    
    
        var passwordcrypt =   req.body.Password;
        bcrypt.hash(passwordcrypt, 10, function (err, hash){
                if (err) {
                    return next(err);
                    }
                     passwordcrypt = hash;   });      
        var userData = {
          username: req.body.txtusername,
          
          password: passwordcrypt,
          Khachhang:[],
        }
        
        //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
          if (err) {
            return next(err)
          } else {
            
            return res.redirect('/Login?signupsuccess=1');
          }
        });
      } 
      else {
        if (result[0]) {
          res.redirect('/Dangky?failusernameexist=1');
          return;
        }
      }

    })
      }}
    
    }
    ));
//Nut Dang Nhap Dang ky
app.post('/newpassword',(function (req, res, next){
  if (req.body.Password !== req.body.Passwordror) {
      var err = new Error('Mật khẩu không trùng! ');
      console.log('Mật khẩu không trùng');
      res.redirect('/Dangky?failpasswordcor=12');

    }
  else{
  if (
      req.body.oldpassword &&
      req.body.Password &&
      req.body.Passwordror) {
      async.parallel([
          function(callback) {
            User.findOne({password: req.body.oldpassword}, "password", function(err, user) {
              if (!err && user) callback(null, true);
              else callback(null, false);
            });
          },
          function(callback) {
            User.findOne({password: req.body.oldpassword}, "password", function(err, user) {
              if (!err && user) callback(null, true);
              else callback(null, false);
            });
          },
        ], function(err, result) {
          if (!result[0]) {

         
            // Create user
       

  
  
  
      var passwordcrypt =   req.body.Password;
      bcrypt.hash(passwordcrypt, 10, function (err, hash){
              if (err) {
                  return next(err);
                  }
                   passwordcrypt = hash;   });      
      var userData = {
        username: req.body.txtusername,
        
        password: passwordcrypt,
      }
      
      //use schema.create to insert data into the db
      User.create(userData, function (err, user) {
        if (err) {
          return next(err)
        } else {
          
          return res.redirect('/Login');
        }
      });
    } 
    else {
      if (result[0]) {
        res.redirect('/Dangky?failusernameexist=1');
        return;
      }
    }

  })
    }}
  
  }
  ));


app.post("/Dangnhap", function(req, res, next){
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function (error, user) {
    if (error || !user) {
      console.log('User not found');
      res.redirect('/Login?faillogin=1');

      } else {
        req.session.userId = user._id;
        return res.redirect('/Admin');
      }
    });
     }else{
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
    });

//Pos Layout

