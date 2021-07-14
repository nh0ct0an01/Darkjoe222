var express = require('express');
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));
app.listen(3000);
//Khai bao password
var session = require('express-session')

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
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png"|| file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" ){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
});

var up1 = upload.single('ImageCMND1');
var up2 = upload.single('ImageCMND2');

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


// body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    
  }));

app.get("/", function(req, res){
    res.render("daohan_login");
});
//Dang nhap
app.get("/Login", function(req, res){
    res.render("daohan_login");
});
app.get("/Dangky", function(req, res){
    res.render("Dangky");
});
app.get("/ResetMK", function(req, res){
    res.render("Home");
});




//Trang chu
app.get("/Admin", function(req, res, next){
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            DSKH.count(function(err, data){
                if(err)
                {}
                else{
                    console.log(data);
                    res.render("Admin",{coun:data});
                }
            })
        }
      }
    });
    
   
});
app.get("/PosAdmin", function(req, res, next){
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            DSKH.count(function(err, data){
                if(err)
                {}
                else{
                    console.log(data);
                    res.render("PosAdmin",{coun:data});
                }
            })
        }
      }
    });
    
   
});

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
    console.log(req.file);
  
      up1(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading." + err); 
           console.log(req.file);
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
        }else{
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
            
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
      
                var dskh =DSKH({
                    
                    NameKh: req.body.txtNameKh,
                    EmailKH: req.body.txtEmailKH,
                    SDTKH: req.body.txtSDTKH,
                    SCMND: req.body.txtCMND,
                    CMNDimage1: req.file.ImageCMND1,
                  
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
                        DSKH.findOneAndUpdate({_id:data._id}, {$push: {Card:dscard._id}},function(err, data){
                            if(err){
                                console.log("chen the an cut roi")
                            }else{
                              
                                res.redirect("Khachhang");
                            }
                        })
                    }
                });  
              }
           })    

    
   
    })



// Get Danh Sach
app.get('/Khachhang' , (req , res)=>{
    DSKH.find(function(err, data){
        if(err){
            console.log("an cut roi")
        }else{
            
            res.render("Khachhang",{ danhsachKH:data})
        }
    });
  

})

app.get('/Khachhangpos' , (req , res)=>{
    DSKH.find(function(err, data){
        if(err){
            console.log("an cut roi")
        }else{
            
            res.render("Khachhangpos",{ danhsachKH:data})
        }
    });
  

})




app.get('/Card/:id' , (req , res)=>{
    // current timestamp in milliseconds
    

    var dskhach = DSKH.aggregate([{
        $lookup:{
            from: "dsthes",
            localField: "Card",
            foreignField: "_id",
            as:"DSTHE"
        }
    }], function(err, pris){
        console.log(pris)
        pris.forEach(function(dskh){ 
                           
                    if(dskh._id ==  req.params.id){
                        

                        res.render("Card",{ danhsachthe:dskh})
                    }
                   
                })
            
        })
   
    })
   

app.post('/Card' , (req , res)=>{ 
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
    var dscard =DSThe({            
        BankName:  req.body.txtBankName,
        STKH: req.body.txtSTKH,
        DateSK: formatDate(req.body.txtDateSK),
        DateTT: formatDate(req.body.txtDateTT),
        HanMuc: req.body.txtHanMuc,
    });
    dscard.save(function(err){
        if(err){
            console.log("luu the an cut roi")
        }else{
            DSKH.findOneAndUpdate({_id:req.body.slcID}, {$push: {Card:dscard._id}},function(err, data){
                if(err){
                    console.log("chen the an cut roi")
                }else{
                    res.redirect("Khachhang");
                }
            })
        }
    })     
    })

//Dao han
app.get('/DaoHan' , (req , res)=>{
    DSKH.find(function(err, data){
        if(err){
            console.log("an cut roi")
        }else{
            
            res.render("DaoHan",{ danhsachKH:data})
        }
    });
  

})

app.get('/Daohanpos' , (req , res)=>{
    DSKH.find(function(err, data){
        if(err){
            console.log("an cut roi")
        }else{
            
            res.render("Daohanpos",{ danhsachKH:data})
        }
    });
  

})




//Nut Dang Nhap Dang ky
app.post('/Dangky',(function (req, res, next){
    if (req.body.Password !== req.body.Passwordror) {
        var err = new Error('Mật khẩu không trùng! ');
        err.status = 400;
        res.send("Mật khẩu không trùng! ");
        return next(err);
      }
    
    if (
        req.body.txtusername &&
        req.body.Password &&
        req.body.Passwordror) {
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
      }}
    ));


app.post("/Dangnhap", function(req, res, next){
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function (error, user) {
    if (error || !user) {
        var err = new Error('Sai tài khoản hoặc mật khẩu');
        err.status = 401;
        return next(err);
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


app.post("/DangNhapPos", function(req, res, next){
    if (req.body.usernamepos && req.body.password) {
        User.authenticate(req.body.usernamepos, req.body.password, function (error, user) {
    if (error || !user) {
        var err = new Error('Sai tài khoản hoặc mật khẩu');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/PosAdmin');
      }
    });
     }else{
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
    });
    
//Trang chu
app.get("/PosAdmin", function(req, res, next){
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            DSKH.count(function(err, data){
                if(err)
                {}
                else{
                    console.log(data);
                    res.render("PosAdmin",{coun:data});
                }
            })
        }
      }
    });
    
   
});
app.get("/DangNhappos", function(req, res){
    res.render("DangNhappos");
});
app.get("/DangkyPos", function(req, res){
    res.render("DangkyPos");
});
app.post('/DangkyPos',(function (req, res, next){
    if (req.body.Password !== req.body.Passwordror) {
        var err = new Error('Mật khẩu không trùng! ');
        err.status = 400;
        res.send("Mật khẩu không trùng! ");
        return next(err);
      }
    
    if (
        req.body.txtusername &&
        req.body.Password &&
        req.body.Passwordror) {
        var passwordcrypt =   req.body.Password;
        bcrypt.hash(passwordcrypt, 10, function (err, hash){
                if (err) {
                    console.log("loi 7");
                    return next(err);
                    }
                     passwordcrypt = hash;   });      
        var userData = {
          username: req.body.txtusername,
          
          password: passwordcrypt,
          IdDaiy:[] ,
          IdNV:[],
          IdKH:[],
          IdDeleteKH:[],
        }
        
        //use schema.create to insert data into the db
        Pos.create(userData, function (err, user) {
          if (err) {
            console.log(user);
            console.log("loi 8");
            return next(err)
          } else {
            console.log("loi 9");
            return res.redirect('/DangNhappos');
          }
        });
      }}
    ));



app.post("/DangNhapPos", function(req, res, next){
    if (req.body.usernamepos && req.body.password) {
        User.authenticate(req.body.usernamepos, req.body.password, function (error, user) {
    if (error || !user) {
        var err = new Error('Sai tài khoản hoặc mật khẩu');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/PosAdmin');
      }
    });
     }else{
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
    });
    
//Trang chu
app.get("/PosAdmin", function(req, res, next){
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
            DSKH.count(function(err, data){
                if(err)
                {}
                else{
                    console.log(data);
                    res.render("PosAdmin",{coun:data});
                }
            })
        }
      }
    });
    
   
});
app.get("/DangNhappos", function(req, res){
    res.render("DangNhappos");
});
app.get("/DangkyPos", function(req, res){
    res.render("DangkyPos");
});
app.post('/DangkyPos',(function (req, res, next){
    if (req.body.Password !== req.body.Passwordror) {
        var err = new Error('Mật khẩu không trùng! ');
        err.status = 400;
        res.send("Mật khẩu không trùng! ");
        return next(err);
      }
    
    if (
        req.body.txtusername &&
        req.body.Password &&
        req.body.Passwordror) {
        var passwordcrypt =   req.body.Password;
        bcrypt.hash(passwordcrypt, 10, function (err, hash){
                if (err) {
                    console.log("loi 7");
                    return next(err);
                    }
                     passwordcrypt = hash;   });      
        var userData = {
          username: req.body.txtusername,
          
          password: passwordcrypt,
          IdDaiy:[] ,
          IdNV:[],
          IdKH:[],
          IdDeleteKH:[],
        }
        
        //use schema.create to insert data into the db
        Pos.create(userData, function (err, user) {
          if (err) {
            console.log(user);
            console.log("loi 8");
            return next(err)
          } else {
            console.log("loi 9");
            return res.redirect('/DangNhappos');
          }
        });
      }}
    ));
// Nhan vien layout
    app.get('/NhanVienPos' , (req , res)=>{
        DSKH.find(function(err, data){
            if(err){
                console.log("an cut roi")
            }else{
                
                res.render("NhanVienPos",{ danhsachKH:data})
            }
        });
      
    
    })

    app.get('/NhanvienDaoHan' , (req , res)=>{
        DSKH.find(function(err, data){
            if(err){
                console.log("an cut roi")
            }else{
                
                res.render("NhanvienDaoHan",{ danhsachKH:data})
            }
        });
      
    
    })
    

    app.get("/DangkyPos", function(req, res){
        res.render("DangkyPos");
    });
    app.post('/DangkyPos',(function (req, res, next){
        if (req.body.Password !== req.body.Passwordror) {
            var err = new Error('Mật khẩu không trùng! ');
            err.status = 400;
            res.send("Mật khẩu không trùng! ");
            return next(err);
          }
        
        if (
            req.body.txtusername &&
            req.body.Password &&
            req.body.Passwordror) {
            var passwordcrypt =   req.body.Password;
            bcrypt.hash(passwordcrypt, 10, function (err, hash){
                    if (err) {
                        console.log("loi 7");
                        return next(err);
                        }
                         passwordcrypt = hash;   });      
            var userData = {
              username: req.body.txtusername,
              
              password: passwordcrypt,
              IdDaiy:[] ,
              IdNV:[],
              IdKH:[],
              IdDeleteKH:[],
            }
            
            //use schema.create to insert data into the db
            Pos.create(userData, function (err, user) {
              if (err) {
                console.log(user);
                console.log("loi 8");
                return next(err)
              } else {
                console.log("loi 9");
                return res.redirect('/DangNhappos');
              }
            });
          }}
        ));
    
    
    
    app.post("/LoginNV", function(req, res, next){
        if (req.body.usernamepos && req.body.password) {
            User.authenticate(req.body.usernamepos, req.body.password, function (error, user) {
        if (error || !user) {
            var err = new Error('Sai tài khoản hoặc mật khẩu');
            err.status = 401;
            return next(err);
          } else {
            req.session.userId = user._id;
            return res.redirect('/PosAdmin');
          }
        });
         }else{
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
      }
        });