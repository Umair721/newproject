const express=require('express');

var bodyParser = require('body-parser');

const app=express();
app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('public'));



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var mysql=require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'registration'
});
 
connection.connect(function(error){
 

  if (error) throw error;
  console.log('Database connected');
});

app.get('/',(req,res)=>{
  var getQuery="select * from `students`";
  connection.query(getQuery,function(err,result){
    if(err) throw err;
    res.render('index',{title:"Registration form",record:result,success:""}); 
  });
  
});app.get('/add_record',(req,res)=>{
  res.render('record_add',{title:""}); 
});
  app.post('/save/',(req,res)=>{
    let data={id:req.body.id,name:req.body.name,email:req.body.email,Rdate:req.body.Rdate};
    
   
    
   let sql='INSERT into `students` SET ?';
   // var query=mysql.format(insertQuery,[id,studentId,termId,addedDate]);
    let query=connection.query(sql,data,(err,result)=>{
  if(err) throw err;
  //console.log(data) 
    var getQuery="select * from `students`";
   connection.query(getQuery,function(err,result){
  
    if(err) throw err;
    res.redirect('/')
   });
  })
  });
app.get('/edit/:id', function(req, res, next) {
  var id=req.params.id;
  
  var getQuery="select * from `students` where `id`=?";
  var query=mysql.format(getQuery,id);
   connection.query(query,function(err,result){
       if(err) throw err;
       var string=JSON.stringify(result);
          var json =  JSON.parse(string);
         
  res.render('edit', { title: '', records:result,success:''});
   
  });
  });
  app.post('/update/',(req,res)=>{
    var userid=req.body.id;
    var id=req.body.id;
    var name=req.body.name;
    var email=req.body.email;
    var Rdate=req.body.Rdate;
    
   var updateQuery='UPDATE `students` SET `id`=?,`name`=?,`email`=?,`Rdate`=? where `id`=?' ;
    var query=mysql.format(updateQuery,[id,name,email,Rdate,id]);
    connection.query(query,function(err,response){
  if(err) throw err;
 
  //console.log(data)
    res.redirect("/");
  });
  });
  
app.get('/delete/:id', function(req, res) {
  var id=req.params.id;

  var deleteQuery="delete from `students` where `id`=?";
  var query=mysql.format(deleteQuery,id);
   connection.query(query,function(err){

       if(err) throw err;
res.redirect('/');
  });
  
});

app.get('/search/:id', function(req, res){ //GET method to access DB and return results in JSON
  console.log("Corona Virus");
  var search_id = req.params.id;
  connection.query('SELECT * FROM students WHERE id=' + search_id,
  function(err, rows, fields){
    if(err) throw err;
    var data = [];
    for(i=0;i<rows.length;i++){

        var search_data = {
          'id' : rows[i].name,
          'name' :  rows[i].name,
          'email' : rows[i].email,
          'Rdata' : rows[i].Rdate
        }

      data.push(search_data);
    }
    res.end(JSON.stringify(data));
  });
}); 



//Exams
app.get('/exam',(req,res)=>{
  var getQuery="select * from `exams`";
  connection.query(getQuery,function(err,result){
    if(err) throw err;
    res.render('exam',{title:"",record:result,success:""}); 
  });
  
});
app.get('/add_exam',(req,res)=>{
  res.render('exam_add',{title:""}); 
});
  app.post('/exam/save',(req,res)=>{
    let data={createId:req.body.createId,startDate:req.body.startDate,endDate:req.body.endDate};
    
   
    
   let sql='INSERT into `exams` SET ?';
   // var query=mysql.format(insertQuery,[id,studentId,termId,addedDate]);
    let query=connection.query(sql,data,(err,result)=>{
  if(err) throw err;
  //console.log(data) 
    var getQuery="select * from `exams`";
   connection.query(getQuery,function(err,result){
  
    if(err) throw err;
    res.redirect('/exam')
   });
  })
  });

//editing 
/*
app.get('/exam/edit/:id', function(req, res, next) {
  var id=req.params.id;
  
  var getQuery="select * from `exams` where `id`=?";
  var query=mysql.format(getQuery,id);
   connection.query(query,function(err,result){
       if(err) throw err;
      
      var string=JSON.stringify(result);
          var json =  JSON.parse(string);
         
  res.render('edit_exam', { title: '', records:result,id:id});
   
  });
  });
  app.post('/exam/edit/',(req,res)=>{
    
    var id=req.body.id;
    var startDate=req.body.startDate;
    var endDate=req.body.endDate;
    
    
    var updateQuery='UPDATE `exams` SET `id`=?,`startDate`=?,`endDate`=?';
    var query=mysql.format(updateQuery,[id,startDate,endDate]);
    connection.query(query,function(err,response){
  if(err) throw err;
 
  //console.log(data)
    res.redirect("/exam");
  });
  });*/
  app.get('/exam/delete/:id', function(req, res) {
    console.log("Working here");
    var customerid=req.params.id;
    let sql=`DELETE from exams where createId=${customerid}`;
    var query=connection.query(sql,(err,result)=>{
         if(err) throw err
         
  res.redirect('/exam');
    });
    
  });
  app.get('/stdinfo',(req,res)=>{
    let sql="select * from `collection`";
    let query=connection.query(sql,(err,row)=>{
      if(err) throw err;
      res.render('stdinfo',{title:"",users:row}); 
    });
    
  });
  app.get('/add_std',(req,res)=>{
  res.render('std_add',{title:""}); 
});
  app.post('/stdinfo/save',(req,res)=>{
    let data={studentId:req.body.studentId,termId:req.body.termId,addedDate:req.body.addedDate};
    
   
    
   let sql='INSERT into `collection` SET ?';
   // var query=mysql.format(insertQuery,[id,studentId,termId,addedDate]);
    let query=connection.query(sql,data,(err,result)=>{
  if(err) throw err;
  //console.log(data) 
    var getQuery="select * from `collection`";
   connection.query(getQuery,function(err,result){
  
    if(err) throw err;
    res.redirect('/stdinfo')
   });
  })
  });
  
  app.get('/stdinfo/delete/:id', function(req, res) {
    console.log("Working here");
    var userid=req.params.id;
    let sql=`DELETE from collection where studentid=${userid}`;
    var query=connection.query(sql,(err,result)=>{
         if(err) throw err;
         res.redirect("/stdinfo")
    });
  });
  
app.get('/stdinfo/search/:studentId', function(req, res){ //GET method to access DB and return results in JSON
  console.log("Corona Virus");
  var search_studentId = req.params.studentId;
  connection.query('SELECT * FROM collection WHERE studentId=' + search_studentId,
  function(err, rows, fields){
    if(err) throw err;
    var data = [];
    for(i=0;i<rows.length;i++){

        var search_data = {
          'studentId' : rows[i].studentId,
          'termId' :  rows[i].termId,
          'addedDate' : rows[i].addedDate
          
        }

      data.push(search_data);
    }
    res.end(JSON.stringify(data));
  });
}); 

  app.get('/dashbord',(req,res)=>{
    res.render('dashbord',{title:""}); 
  });
 

app.listen(3000,()=>console.log("created"));
 

