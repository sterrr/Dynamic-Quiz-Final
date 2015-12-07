var fs = require("fs");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');  
var path = require('path');
var ejs = require('ejs');


app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(process.env.PORT || 3000);

app.use("/public", express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs'); //sets view engine

	
app.get('/', function(req, res) { //Returns all Quiz Titles from Quizzes
  var quizlist =  {titles:[], id:[]};
  var allquizzes = require('./data/Quizzes.json');
  for (var x = 0; x < allquizzes.length; x++){
      quizlist.titles.push(allquizzes[x].title);
      quizlist.id.push(allquizzes[x].id);
  }
  res.render('index.ejs', {list: quizlist});
    console.log(quizlist);
    console.log("Titles Loaded");
});


app.get('/quiz', function(req, res) {//Returns all Quiz Titles from Quizzes
  var quizlist =  {titles:[], id:[]};
  var allquizzes = require('./data/Quizzes.json');
  for (var x = 0; x < allquizzes.length; x++){
      quizlist.titles.push(allquizzes[x].title);
      quizlist.id.push(allquizzes[x].id);
  }
  res.render('index.ejs', {list: quizlist});
    console.log(quizlist);
    console.log("Titles Loaded!");
});


app.get('/quiz/:id', function(req, res) {// Returns a Single Quiz from Quizzes
  var id = req.params.id;
  var allquizzes = require('./data/Quizzes.json');
  var choicequiz = allquizzes[id-1];
  res.send(choicequiz);
  console.log("Quiz Chosen!");
});


app.delete('/quiz/:id', function(req, res){ //Deleted Chosen Quiz from Quizzes
  var deleteid = req.params.id;
  var deletequizzes = require('./data/Quizzes.json');
  deletequizzes.splice(deleteid-1, 1);

  for(var i = deleteid-1; i<deletequizzes.length; i++){
 deletequizzes[i].id=deletequizzes[i].id-1;
  }

  var splicedquizzes = JSON.stringify(deletequizzes, null, 4);
  fs.writeFileSync('./data/Quizzes.json', splicedquizzes, 'utf8');
  console.log("Quiz Deleted!!!");
});

app.put('/quiz/:id', function(req, res) { //Updates Chosen Quiz from Quizzes
  var putquizzes = require('./data/Quizzes.json');
  putquizzes[req.params.id-1] = req.body;
  var putstring = JSON.stringify(putquizzes, null, 4);
  fs.writeFile('./data/Quizzes.json', putstring);
  console.log("Quiz Updated!");
  res.send(putquizzes);
});

app.post('/quiz', function(req, res) { //Creates New Quiz and adds it to Quizzes.json
  var postquizzes = require('./data/Quizzes.json');
  var postaddquiz = req.body;
  postaddquiz.id = postquizzes.length+1;
  postquizzes[postaddquiz.id-1] = postaddquiz;
  var poststring = JSON.stringify(postquizzes, null, 4);
  fs.writeFile('./data/Quizzes.json', poststring);
  console.log('New Quiz Created!');
  });








 