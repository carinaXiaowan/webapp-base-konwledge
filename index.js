const express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public')); //设定静态文件的根目录

app.get('/',function(req, res){
    res.render('rem', {});
})
app.get('/viewport',function(req, res){
    res.render('viewport', {});
})      
app.get('/onepx',function(req, res){
    res.render('onepx', {});
})
app.get('/eventTouch',function(req, res){
    res.render('eventTouch', {});
})
app.listen(3000);
console.info('serve is listen at 3000');