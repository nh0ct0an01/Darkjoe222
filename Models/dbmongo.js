var mongoose = require("mongoose");

var schemaKhachHang = new mongoose.Schema({
    
    NameKh: String,
    EmailKH: String,
    SDTKH: String,
    SCMND: String,
    CMNDimage1: String,
    CMNDimage2: String,
    
    Card: [{type:mongoose.Schema.Types.ObjectId}],

   
});

module.exports = mongoose.model("DSKH", schemaKhachHang);
