const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;


mongoose.Query.prototype.exec = function (){
    console.log('I always run before query');
    return exec.apply(this,arguments);
}

