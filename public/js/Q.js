//In this version of the quiz, the photo/sound elements are not utilized.
//The League of Legends metatag may give images of people dressed up as characters from the game
//High Scores are not fully implemented
//Delete functionality is not finished



//Please turn sound on for full enjoyment of the project
(function() {
    //Conceals quiz upon opening the HTML page
    $("#container1").hide();
    $("#container2").hide();
    $("#container3").hide();
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
    var quizedit = null;
    var id = null;
    var editid = null;
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
    
    
    
 ///////// Delete Functionality /////////   
     $(".delete").click(function() { 
        $.ajax({
            url: "/quiz/" + $(this).attr("alt"),
            type: "DELETE"
        })
        
    });
    
    
    
    
/////////Create Functionality///////////
    
    var createholder = 0;
    $("#create").click(function() { 
        $("#Login").hide();
             $("#menucontainer").hide();
            $('#container3').show();
            $("#container3").empty(); 
            $("#container3").append("<h1>Make your quiz!</h1>").hide().fadeIn(); 
            $("#container3").append("<h4>Note: The correct answer field takes a numermical value that corresponds to the correct answer's position in an array. The first item in any array is at a position of zero and all subsequent items' positions count up by one!,</h4>");
            $("#container3").append("<div class=\"col-md-8 col-md-offset-2 choices radio\" id=\"interface\">"); 
            $("#interface").append("<form id='makequiz' class='form-horizontal'>");  
            $(".form-horizontal").append('<div class="form-group"><label for="title" class="col-sm-2 control-label">Title</label><div class="col-sm-10"><input type="text" class="form-control" id="title" name="title" placeholder="Title"></div></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="description" class="col-sm-2 control-label">Description</label><div class="col-sm-10"><textarea rows="2" class="form-control" id="description" name="description" placeholder="Description"></textarea></div></div>');
            $(".form-horizontal").append('<div class="form-group form-group-meta-tags-quiz"><label for="meta_tags" class="col-sm-2 control-label">Meta Tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" placeholder="Meta Tag"></div><a><button id="addmetatagstoquiz" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Meta Tag</button></a></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="difficulty" class="col-sm-2 control-label">Difficulty</label><div class="col-sm-10"><input type="text" class="form-control" id="difficulty" name="difficulty" placeholder="Difficulty, from 1-20"></div></div>');

            for (var x = 0; x < 5; x++){
            $(".form-horizontal").append('<hr>');
            $(".form-horizontal").append('<h4>Question ' + (x+1) + '</h4>');
            $(".form-horizontal").append('<div class="form-group"><label for="question' + (x+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (x+1) + '" name="questions[' + x + '][text]" placeholder="Text"></div></div>');
            $(".form-horizontal").append('<div class="form-group" alt="' + x + '"><label for="answerchoice' + (x+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (x+1) + '" name="questions[' + x + '][answers][]" placeholder="Answer Choice"></div><a><button id="addchoicestoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Asnwer Choice</button></a></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (x+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (x+1) + '" name="questions[' + x + '][correct_answer]" placeholder="Correct Answer"></div></div>');
            $(".form-horizontal").append('<div class="form-group" alt="' + x + '"><label for="meta_tags' + (x+1) + '" class="col-sm-2 control-label">Meta Tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (x+1) + '" name="questions[' + x + '][meta_tags][]" placeholder="Meta Tag"></div><a><button id="addmetatagstoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Meta Tag</button></a></div>');
            createholder = x+1;
        }
            $("#interface").append('<center><a><button id="addquestions" type="button" class="btn btn-info btn-lg.round"><i class="icon-plus-sign"></i><center>Add more Questions</center></button></a></center>')
            
            $("#interface").append('<br>')
            $("#interface").append('<center><a href="/"><button id="makequizbutton" type="button" class="btn btn-primary btn-lg.round nav pull-left"><i class="icon-upload-alt" vertical-align: middle></i>Submit Edited Quiz</button></a></center>')
    });

    $("#container3").on("click", "#addmetatagstoquiz", function(){ 
        $(".form-group-meta-tags-quiz").append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" placeholder="Meta Tag"></div>');
    });
    $("#container3").on("click", "#addmetatagstoquestion", function(){ 
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][meta_tags][]" placeholder="Meta Tag"></div>');
    });
    $("#container3").on("click", "#addchoicestoquestion", function(){ 
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][answers][]" placeholder="Answer Choice"></div>');
    });
    $("#container3").on("click", "#addquestions", function() {
        $(".form-horizontal").append('<hr>');
        $(".form-horizontal").append('<h4>Question ' + (createholder+1) + '</h4>');
        $(".form-horizontal").append('<div class="form-group"><label for="question' + (createholder+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (createholder+1) + '" name="questions[' + createholder + '][text]" placeholder="Text"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + createholder + '"><label for="answerchoice' + (createholder+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (createholder+1) + '" name="questions[' + createholder + '][answers][]" placeholder="Answer Choice"></div><a><button id="addchoicestoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Answer Choice</button></a></div>');
        $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (createholder+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (createholder+1) + '" name="questions[' + createholder + '][correct_answer]" placeholder="Correct Answer "></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + createholder + '"><label for="meta_tags' + (createholder+1) + '" class="col-sm-2 control-label">Meta Tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (createholder+1) + '" name="questions[' + createholder + '][meta_tags][]" placeholder="Meta Tag"></div><a><button id="addmetatagstoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Meta Tag</button></a></div>');
        createholder++;
    });
    
    
    
    $("#container3").on("click", "#makequizbutton", function() { 
        var makequizform = $("form#makequiz").serializeObject();
        
        
        console.log(makequizform);
        
        for (var v = 0; v < makequizform.questions.length; v++){ 
            makequizform.questions[v].global_correct = 0;
            makequizform.questions[v].global_total = 0;
        }
        
        stufftosend = JSON.stringify(makequizform);
        $.ajax({
          method: "POST",
          url: "/quiz",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
          data: stufftosend
        })
          
    }); 
  
    
    
    
    
    
///////// Edit Functionality ///////////
     var editholder = 0;
    // var deletes=0;
    $(".edit").click(function() { 
        
        $.ajax({
                url: "/quiz/" + $(this).attr("alt"),
                dataType: "text",
                success: function(data) {
                    quizedit = $.parseJSON(data);
                    console.log(quizedit);
                },
                async: false
        });
        
        console.log("EDIT");
        
            $("#Login").hide();
             $("#menucontainer").hide();
            $('#container2').show();
            $("#container2").empty(); 
            $("#container2").append("<h1>Edit Away!</h1>").hide().fadeIn(); 
            $("#container2").append("<h4> Note: The correct answer field takes a numermical value that corresponds to the correct answer's position in an array. The first item in any array is at a position of zero and all subsequent items' positions count up by one!</h4>");
            $("#container2").append("<div class=\"col-md-8 col-md-offset-2 choices radio\" id=\"interface\">"); 
            $("#interface").append("<form id='editquiz' class='form-horizontal'>");  
             $(".form-horizontal").append('<div class="form-group"><label for="title" class="col-sm-2 control-label">Title</label><div class="col-sm-10"><input type="text" class="form-control" id="title" name="title" value="' + quizedit.title + '"placeholder="Title"></div></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="description" class="col-sm-2 control-label">Description</label><div class="col-sm-10"><textarea rows="2" class="form-control" id="description" name="description" placeholder="Description">' + quizedit.description + '</textarea></div></div>');

            $(".form-horizontal").append('<div class="form-group form-group-meta-tags-quiz"><label for="meta_tags" class="col-sm-2 control-label">Meta Tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" value="' + quizedit.meta_tags[0] + '"placeholder="Meta Tag"></div><a><button id="addmetatagstoquizedit" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Meta Tag</button></a></div>');
            for (var metatagsforquiz = 1; metatagsforquiz < quizedit.meta_tags.length; metatagsforquiz++){
            $(".form-group-meta-tags-quiz").append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" value="' + quizedit.meta_tags[metatagsforquiz] + '" placeholder="Answer Choice"></div>');
            }
            $(".form-horizontal").append('<div class="form-group"><label for="difficulty" class="col-sm-2 control-label">Difficulty</label><div class="col-sm-10"><input type="text" class="form-control" id="difficulty" name="difficulty" value="' + quizedit.difficulty + '" placeholder="Difficulty, from 1-20"></div></div>');

            for (var x = 0; x < quizedit.questions.length; x++){
            $(".form-horizontal").append('<hr>');
            $(".form-horizontal").append('<h4>Question ' + (x+1) + '</h4>');
                
                
            $(".form-horizontal").append('<div class="form-group"><label for="question' + (x+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (x+1) + '" name="questions[' + x + '][text]" value="' + quizedit.questions[x].text + '" placeholder="Text"></div></div>');

            $(".form-horizontal").append('<div class="form-group" id="question' + x + '" alt="' + x + '"><label for="answerchoice' + (x+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (x+1) + '" name="questions[' + x + '][answers][]" value="' + quizedit.questions[x].answers[0] + '" placeholder="Answer Choice"></div><a><button id="addchoicestoquestionedit" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Answer Choice</button></a></div>');
            for (var questionsforquiz = 1; questionsforquiz < quizedit.questions[x].answers.length; questionsforquiz++){
            $("#question" + x).append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $("#question" + x).attr("alt") + '][answers][]" value="' + quizedit.questions[x].answers[questionsforquiz] + '" placeholder="Answer Choice"></div>');
            }

            $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (x+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (x+1) + '" name="questions[' + x + '][correct_answer]" value="' + quizedit.questions[x].correct_answer + '" placeholder="Correct Answer"></div></div>');

            $(".form-horizontal").append('<div class="form-group" id="metatagforquestion' + x + '" alt="' + x + '"><label for="meta_tags' + (x+1) + '" class="col-sm-2 control-label">Meta Tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (x+1) + '" name="questions[' + x + '][meta_tags][]" value="' + quizedit.questions[x].meta_tags[0] + '" placeholder="Meta Tag"></div><a><button id="addmetatagstoquestionedit" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Meta Tag</button></a></div>');
            for (var metatagsforquestions = 1; metatagsforquestions < quizedit.questions[x].meta_tags.length; metatagsforquestions++){
            $("#metatagforquestion" + x).append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $("#question" + x).attr("alt") + '][meta_tags][]" value="' + quizedit.questions[x].meta_tags[metatagsforquestions] + '" placeholder="Meta Tag"></div>');
            }

            editholder = x+1;
        }
            $("#interface").append('<center><a><button id="addquestionsedit" type="button" class="btn btn-info btn-lg.round"><i class="icon-plus-sign"></i><center>Add more Questions</center></button></a></center>')
          //  $("#interface").append('<center><a><button id="deletequestionedit" type="button" class="btn btn-info btn-lg.round"><i class="icon-plus-sign"></i> Delete Questions</button></a></center>')
            $("#interface").append('<br>')
            $("#interface").append('<center><a href="/"><button id="editquizbutton" type="button" class="btn btn-primary btn-lg.round nav pull-left"><i class="icon-upload-alt" vertical-align: middle></i>Submit Edited Quiz</button></a></center>')
    });
 

    
    $("#container2").on("click", "#addmetatagstoquizedit", function(){ 
        $(".form-group-meta-tags-quiz").append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags[]" name="meta_tags" placeholder="Meta Tag"></div>');
    });
    
    $("#container2").on("click", "#addmetatagstoquestionedit", function(){
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][meta_tags][]" placeholder="Meta Tag"></div>');
    });
    $("#container2").on("click", "#addchoicestoquestionedit", function(){ 
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][answers][]" placeholder="Answer Choice"></div>');
    });
    $("#container2").on("click", "#addquestionsedit", function() {
        $(".form-horizontal").append('<hr>');
        $(".form-horizontal").append('<h4>Question ' + (editholder+1) + '</h4>');
        $(".form-horizontal").append('<div class="form-group"><label for="question' + (editholder+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (editholder+1) + '" name="questions[' + editholder + '][text]" placeholder="Text"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + editholder + '"><label for="answerchoice' + (editholder+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (editholder+1) + '" name="questions[' + editholder + '][answers][]" placeholder="Answer Choice"></div><a><button id="addchoicestoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Answer Choice</button></a></div>');
        $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (editholder+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (editholder+1) + '" name="questions[' + editholder + '][correct_answer]" placeholder="Correct Answer"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + editholder + '"><label for="meta_tags' + (editholder+1) + '" class="col-sm-2 control-label">Meta Tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (editholder+1) + '" name="questions[' + editholder + '][meta_tags][]" placeholder="Meta Tag"></div><a><button id="addmetatagstoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Meta Tag</button></a></div>');
        editholder++;
    });
    
    /*$("#container2").on("click", '#deletequestionedit', function() {
        console.log(quizedit);
       quizedit.questions.splice(editholder-1, 1);
        editholder--;
        deletes++;
        $("#deletequestionedit").html('Delete a Question! # of  Pending Deleted Questions: '+deletes+"");
        });*/
    $("#container2").on("click", "#editquizbutton", function() { 
        var editquizform = $("form#editquiz").serializeObject();
        console.log(editquizform);
        if (editquizform.questions.length <= quizedit.questions.length){
        for (var w = 0; w < editquizform.questions.length; w++){ 
            editquizform.questions[w].global_correct = quizedit.questions[w].global_correct;
            editquizform.questions[w].global_total = quizedit.questions[w].global_total;
            }
        }
        else {
        for (var z = 0; z < quizedit.questions.length; z++){
            editquizform.questions[z].global_correct = quizedit.questions[z].global_correct;
            editquizform.questions[z].global_total = quizedit.questions[z].global_total;
            }
        for (var y = quizedit.questions.length; y < editquizform.questions.length; y++){
            editquizform.questions[y].global_correct = 0;
            editquizform.questions[y].global_total = 0;
        }
        }
        
        editquizform.id = quizedit.id;
        var thingstosend = JSON.stringify(editquizform);
        
        console.log(thingstosend);
        
        $.ajax({
          method: "PUT",
          url: "/quiz/" + quizedit.id,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
          data: thingstosend
        })
          
    });
    
    ///////////////// Choose Functionality ////////////////

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
        	$("#results").append("<h3>" + quiz.questions[i].text + "<h3>");
            
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