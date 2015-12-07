//In this version of the quiz, the photo/sound elements are not utilized.
//The League of Legends metatag may give images of people dressed up as characters from the game
//High Scores are not fully implemented



//Please turn sound on for full enjoyment of the project
(function() {
    //Conceals quiz upon opening the HTML page
    $("#container1").hide();
    $("#minutes").hide();
    $("#seconds").hide();
    $('#pie').hide();
    $("#questionstat").hide();
     $('#results').hide();
    $("html").css("background-image", "url('./Photos/Capture2.JPG')");

    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var quizdiv = $('#quizdiv'); //quiz div object
    var quiz = null;
    var id = null;
    var scores = [];
    var numCorrect = 0; //Number of user answers that are correct
    var numWrong = 0; //Number of user answers that are wrong
    var name = ""; //User inputed name
    var sec = 0; //Used for timer
    var sectime = ""; //Used to save timer value
    var mintime = ""; //Used to save timer value
    var myJsonString;
  

    //These are for the audio clips that play in the quiz
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', '.public/Music/Jeopardy.mp3'); // The background music

    var audioElement2 = document.createElement('audio');
    audioElement2.setAttribute('src', '.public/Music/Swoosh.mp3'); // The transition music

    
   

    // Next Button
    $('#next').on('click', function(e) {
        e.preventDefault();

        // Suspend click listener during fade animation
        if (quizdiv.is(':animated')) {
            return false;
        }
        choose();

        // Selection Validation
        if (isNaN(selections[questionCounter])) {
            alert('Please Answer the Question!');
        } else {
            questionCounter++;
            displayNext();
            loadFlickr(quiz.questions[questionCounter].meta_tags);
            audioElement.currentTime = 0; // Resets Jeopardy Music upon switching questions
            audioElement.play();
            audioElement2.play();
        }
    });

    // Back Button
    $('#prev').on('click', function(e) {
        e.preventDefault();

        if (quizdiv.is(':animated')) {
            return false;
        }
        choose();
        questionCounter--;
        displayNext();
        loadFlickr(quiz.questions[questionCounter].meta_tags);
    });

    // Start Over Button
    $('#start').on('click', function(e) {
        e.preventDefault();

        if (quizdiv.is(':animated')) {
            return false;
        }
        questionCounter = 0;
        stat = "";
        numCorrect = 0;
        numWrong = 0;
        audioElement.play();
        audioElement2.play();
        $("#time").hide();
        selections = [];
        displayNext();
        $('#image').show();
        $('#start').hide();
        $('#pie').hide();
        $("#questionstat").hide();
        //clears results html element
        $("#results").html(""); 
        //get timer to reset  
        $("#minutes").html('00');
        $("#seconds").html('00');
        sec = 0;
    });
    
     $(".delete").click(function() { 
        $.ajax({
            url: "/quiz/" + $(this).attr("alt"),
            type: "DELETE"
        })
        
    });

    $(".choose").click(function() { //This is the code that activates when the form is validated

        if (validateForm() == true) {
            $("#Login").hide();
             $("#menucontainer").hide();
             $.ajax({
                url: "/quiz/" + $(this).attr("alt"),
                dataType: "text",
                success: function(data) {
                    quiz = $.parseJSON(data);
                    console.log(quiz);
                    
                    
                },
                async: false
            });
            id = quiz.id
            console.log(id);
            $('#header').text(quiz.title);
	        $('#description').text(quiz.description);
            $('#title1').text(quiz.title);
            $("#container1").show();
            displayNext();
            
            audioElement.play();
            audioElement2.play();
            $("#minutes").show();
            $("#seconds").show();
            $("html").css("background-image", "url('./Photos/Capture1.JPG')");
            
            

            //Below is code used for the time in the container
            var timer = setInterval(function() {
                if (!($('#pie').is(":visible"))) {
                    document.getElementById("seconds").innerHTML = numpad(++sec % 60);
                    document.getElementById("minutes").innerHTML = numpad(parseInt(sec / 60, 10));
                }
            }, 1000);
        }
    });



    // Makes the buttons change color when moused over
    $('.button').on('mouseenter', function() {
        $(this).addClass('active');
    });
    $('.button').on('mouseleave', function() {
        $(this).removeClass('active');
    });


    function createQuestionElement(index) { // Creates and returns the div that contains the questions and the answer selections
        var qElement = $('<div>', {
            id: 'question'
        });

        var header = $('<h2>Question ' + (index + 1) + ':</h2>');
        qElement.append(header);

        var question = $('<p>').append(quiz.questions[index].text);
        qElement.append(question);

        var radioButtons = RadioButton(index);
        qElement.append(radioButtons);

        return qElement;
    }


    function RadioButton(index) { // Converts list of the answer choices to radio button inputs
        var radioList = $('<ul>');
        var item;
        var input = '';
        for (var i = 0; i < quiz.questions[index].answers.length; i++) {
            item = $('<li>');
            input = '<input type="radio" name="answer" value=' + i + ' />';
            input += quiz.questions[index].answers[i];
            item.append(input);
            radioList.append(item);
        }
        return radioList;
    }


    function choose() { // Takes user selection and adds it to an array
        selections[questionCounter] = +$('input[name="answer"]:checked').val();
    }


    function displayNext() { // Displays next element
        
        
        
        quizdiv.fadeOut(function() {
            $('#question').remove();

            if (questionCounter < quiz.questions.length) {
                var nextQuestion = createQuestionElement(questionCounter);
                quizdiv.append(nextQuestion).fadeIn();
                if (!(isNaN([questionCounter]))) {
                    $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
                }

                // Controls display of 'prev' button
                if (questionCounter === 1) {
                    $('#prev').show();
                } else if (questionCounter === 0) {

                    $('#prev').hide();
                    $('#next').show();
            loadFlickr(quiz.questions[questionCounter].meta_tags);
                }
            } else {
                audioElement.pause();
                audioElement2.pause();
                mintime = $("#minutes").html();
                sectime = $("#seconds").html();
                $('#image').hide();
                $('#image').html("")
                var statElem = displayStat();
                quizdiv.append(statElem).fadeIn();
                $('#next').hide();
                $('#prev').hide();
                $('#start').show();
                
               loadScores();
                
                var User = {
		          "username": name,
		          "quizscore": numCorrect/quiz.questions.length,
                  "time": "" + mintime + " : " + sectime + ""
	               }
                
                

	           scores.push(User);
                
                postScores();
                
        
                console.log(quiz);
                
                var thingstosend = JSON.stringify(quiz);
                $.ajax({
        type: "PUT",
        url : "/quiz/" + id,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data : thingstosend
    });
                
             
               

                //The block below corresponds to the pie chart produced at the end
                var data = [((numCorrect) / (quiz.questions.length)) * 360, ((numWrong) / (quiz.questions.length)) * 360];
                var labels = ["Correct", "Wrong"];
                var colors = ["#33CC33", "#CC0000"];
                $("#pie").html("<br><br><br><center><canvas id=\"piechart\" width=\"300\" height=\"300\"></canvas><center>");
                $('#pie').show();
                canvas = document.getElementById("piechart");
                var context = canvas.getContext("2d");
                for (var i = 0; i < data.length; i++) {
                    drawSegment(canvas, context, i, data, colors, labels);
                }
                
                $("#results").append("<h2>" + "You vs The World:" + "</h2>");
        $("#results").append("<br>");

        for (var i=0; i<quiz.questions.length; i++){ // returns the users answer for the questions, whether it is right or wrong, and compares it to the global variables
        	$("#results").append("<h3> Question " + [i+1] + ".) "+ quiz.questions[i].text + "<h3>");
            
        if(selections[i] == quiz.questions[i].correct_answer){
        	$("#results").append("You got it right! The Global Percentage of Correct Answers for this Question is " + (100*(quiz.questions[i].global_correct/quiz.questions[i].global_total)).toFixed(2) + "% in " + quiz.questions[i].global_total +" Total Playthroughs"); 
        }
        if(selections[i] != quiz.questions[i].correct_answer){
        	$("#results").append("You got it wrong! The Global Percentage of Correct Answers for this Question is " + (100*(quiz.questions[i].global_correct/quiz.questions[i].global_total)).toFixed(2) + "% in " + quiz.questions[i].global_total +" Total Playthroughs");
        }
        $("#results").append("<br>");
            $('#results').show();
    }
               
    
            }
        });
    }
    
   

    
    
  

  
    function loadScores(){
         $.ajax({
            method: "GET",
             url: "/highscores",
            dataType: "text",
             success: function(data) {
              scores = $.parseJSON(data);
             console.log(scores);
            }
         });
    }
    
    function postScores(){
     $.ajax ({
        type: "POST",
        url: "/highscores",
        data: JSON.stringify(scores),
        contentType: "application/json"
    });
    }
    
    function loadFlickr(meta_tags) {
      
       
         $.getJSON("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=44a4d773a71dfa0549f44f4ac10d4afe&tags=" + meta_tags + "&tag_mode=all&privacy_filter=1&per_page=50&format=json&nojsoncallback=1", displayImages);
    }
    
    
    function displayImages(data) {
        
        var htmlString = "";
        htmlString += '<br><a href="' + "https://farm" + data.photos.photo[0].farm + ".staticflickr.com/" + data.photos.photo[0].server +
            "/" + data.photos.photo[0].id + "_" + data.photos.photo[0].secret + ".jpg" + '" target="_blank">';
        htmlString += '<img title="' + data.photos.photo[0].title + '" src="' + "https://farm" + data.photos.photo[0].farm + ".staticflickr.com/" + data.photos.photo[0].server + "/" + data.photos.photo[0].id + "_" + data.photos.photo[0].secret + ".jpg";
        htmlString += '" alt="';
        htmlString += data.photos.photo[0].title + '" />';
        htmlString += '</a>';
       
        $('#image').html(htmlString);
        
    }
    

    function numpad(val) { //Utilized to pad values for the timer
        return val > 9 ? val : "0" + val;
    }


    function validateForm() { //Validates that the user has inputted a name
        var usernameElement = document.getElementById('NAME');
        name = $("#NAME").val();
        if (usernameElement.value == null | usernameElement.value == "") {
            return false; // If no name is selected, the quiz will not run
        } else {
            return true;
        }
    }


    function displayStat() { //Gives the user their right and wrong answers
        var stat = $('#questionstat');
        stat.show();

        for (var i = 0; i < selections.length; i++) {
            if (selections[i] == quiz.questions[i].correct_answer) {
                numCorrect++;
                quiz.questions[i].global_correct++;
            }
            if (selections[i] != quiz.questions[i].correct_answer) {
                numWrong++;
            }
            quiz.questions[i].global_total++;

        }

        stat.html('Nice Work ' + name + '! You got ' + numCorrect + ' questions out of ' +
            quiz.questions.length + ' right! You got ' + numWrong + ' questions out of ' +
            quiz.questions.length + ' wrong! It took you ' + mintime + ':' + sectime + ' to complete the quiz!');
        return  stat;
    }



    // The below functions are related to the production of the pie chart-used tutorial on wickedlysmart.com
    function drawSegment(canvas, context, i, data, colors, labels) {
        context.save();
        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        radius = Math.floor(canvas.width / 2);

        var startingAngle = degreesToRadians(sumTo(data, i));
        var arcSize = degreesToRadians(data[i]);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius,
            startingAngle, endingAngle, false);
        context.closePath();

        context.fillStyle = colors[i];
        context.fill();

        context.restore();

        drawSegmentLabel(canvas, context, i, labels, data);
    }

    function degreesToRadians(degrees) {
        return (degrees * Math.PI) / 180;
    }

    function sumTo(a, i) {
        var sum = 0;
        for (var j = 0; j < i; j++) {
            sum += a[j];
        }
        return sum;
    }


    function drawSegmentLabel(canvas, context, i, labels, data) {
        context.save();
        var x = Math.floor(canvas.width / 2);
        var y = Math.floor(canvas.height / 2);
        var angle = degreesToRadians(sumTo(data, i));

        context.translate(x, y);
        context.rotate(angle);
        var dx = Math.floor(canvas.width * 0.5) - 10;
        var dy = Math.floor(canvas.height * 0.05);

        context.textAlign = "right";
        var fontSize = Math.floor(canvas.height / 25);
        context.font = fontSize + "pt Helvetica";

        context.fillText(labels[i], dx, dy);

        context.restore();
    }
})();