var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const { schema } = require('./dbmongo');
var Schema = mongoose.Schema;
var Schema = new Schema({
    taikhoan:{type: String, required: true},
    email: {type: String, required: true},
    password: {type : String, required:true},
    IdKH:[{type:mongoose.Schema.Types.ObjectId}],


});
schema.methods.encryptPassword= function(password){
    return bcrypt.hashSync(password, brypt.genSaltSync(5),null);
};
schema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('NhanVienPos', schema);