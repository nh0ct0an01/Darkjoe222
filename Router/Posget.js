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
app.get('/Khachhangpos' , (req , res)=>{
    DSKH.find(function(err, data){
        if(err){
            console.log("an cut roi")
        }else{
            
            res.render("Khachhangpos",{ danhsachKH:data})
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


