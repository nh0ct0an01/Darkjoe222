//load nhung thu vien can
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var PosSchema = mongoose.Schema({
    username:{type: String, required: true},
    password: {type : String, required:true},
    IdDaiy: [{type:mongoose.Schema.Types.ObjectId}],
    IdNV:[{type:mongoose.Schema.Types.ObjectId}],
    IdKH:[{type:mongoose.Schema.Types.ObjectId}],
    IdDeleteKH:[{type:mongoose.Schema.Types.ObjectId}],


});
//authenticate input against database
PosSchema.statics.authenticate = function (username, password, callback) {
  Pos.findOne({ username: username })
      .exec(function (err, user) {
        if (err) {
          console.log("loi 1");
          return callback(err)
        } else if (!user) {
          var err = new Error('User not found.');
          err.status = 401;
          console.log("loi 2");
          return callback(err);
         
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (result === true) {
            console.log("loi 3");
            return callback(null, user);
          } else {
            console.log("loi 4");
            return callback();
          }
        })
      });
  }
  
  //hashing a password before saving it to the database
  PosSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (err) {
        console.log("loi 5");
        return next(err);
      }
      user.password = hash;
      next();
    })
  });
var Pos = mongoose.model('Pos', PosSchema);
module.exports = Pos;
