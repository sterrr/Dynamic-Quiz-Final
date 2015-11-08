var fs = require("fs");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');  
var path = require('path');

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static('public'));

app.listen(process.env.PORT || 3000);

app.use("/public", express.static(path.join(__dirname,'public')));

app.get('/', function (req, res) {
  var content = fs.readFileSync("public/index.html", 'utf8');
  res.send(content);
});

app.get('/quiz', function (req, res) {
  var content = fs.readFileSync("data/questions.json", 'utf8');
  res.send(content);
});



app.post('/quiz', function (req, res) {
    fs.writeFileSync("data/questions.json", JSON.stringify(req.body));
    res.send("Please Work...");
});

app.get('/highscores', function (req, res) {
    var scorecontent = fs.readFileSync("data/TopUsers.json");
	res.send(scorecontent);
});

app.post('/highscores', function (req, res) {
    fs.writeFileSync("data/TopUsers.json", JSON.stringify(req.body));
    res.send("I want to be the very best!");
});


 