var mongoose = require("mongoose");

var schemaDSCard = new mongoose.Schema({
    
   
    BankName: String,
    STKH: String,
    DateSK: String,
    DateTT: String,
    HanMuc: Number,
    DateTan: String,
   
});

module.exports = mongoose.model("DSThe", schemaDSCard);
