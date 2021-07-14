// config/passport.js
// load các module
var passport = require('passport');
// load user model
var User = require('../models/user.model');
var LocalStrategy = require('passport-local').Strategy;
// passport session setup
// used to serialize the user for the session
sport.serializeUser(function(user, done){
done(null, user.id);
})
// used to deserialize the user
passport.deserializeUser(function(id, done){
User.findById(id, function(err, user){
done(err, user);
})
})
// local sign-up
passport.use('local.signup',new LocalStrategy({
// mặc định local strategy sử dụng username và password
//chúng ta có thể cấu hình lại
usernameField:'email',
passwordField:'password',
passReqToCallback:true // cho phép chúng ta gửi reqest lại hàm callback
},function(req, email, password,done){
// Tìm một user theo email
// chúng ta kiểm tra xem user đã tồn tại hay không
User.findOne({ 'email': email }, function(err, user) {
if (err) { return done(err); }
if (user) {
return done(null, false, { message : 'Email is already in use.'})
}
// Nếu chưa user nào sử dụng email này
// tạo mới user
var newUser= new User();
// lưu thông tin cho tài khoản local
newUser.email= email;
newUser.password=
newUser.encryptPassword(password);
// lưu user
newUser.save(function(err, result){
if(err){
return done(err)
}
return done(null, newUser);
})
});
}
));


