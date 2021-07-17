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