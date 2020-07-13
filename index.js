const express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public')); //设定静态文件的根目录

app.use('/',function(req, res){
    res.render('index', {});
})

app.listen(3000);
console.info('serve is listen at 3000');