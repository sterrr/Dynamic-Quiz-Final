//In this version of the quiz, the photo/sound elements are not utilized.
//The League of Legends metatag may give images of people dressed up as characters from the game
//High Scores are not fully implemented



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
    
    
    var altholder = 0;
    $("#create").click(function() { //the function used to create a form to make a quiz.
        console.log("CREATE");
            $("#Login").hide();
             $("#menucontainer").hide();
            $("#container3").show()
            $("#container3").empty(); //clears the container HTML div so i can make new stuff in it
            $("#container3").append("<h1>Make your quiz!</h1>").hide().fadeIn(1000); //fadeIn all new HTML
            $("#container3").append("<h4>The correct answer text field accepts an array placement number. This means that if the correct answer choice is the first answer choice listed, then the correct answer would be '0'. Thus, the second would be '1', third would be '2', etc.");
            $("#container3").append("<div class=\"col-md-8 col-md-offset-2 choices radio\" id=\"interface\">"); //making a dynamic div
            $("#interface").append("<form id='makequiz' class='form-horizontal'>");  
            $(".form-horizontal").append('<div class="form-group"><label for="title" class="col-sm-2 control-label">Title</label><div class="col-sm-10"><input type="text" class="form-control" id="title" name="title" placeholder="Title"></div></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="description" class="col-sm-2 control-label">Description</label><div class="col-sm-10"><textarea rows="2" class="form-control" id="description" name="description" placeholder="Description"></textarea></div></div>');
            $(".form-horizontal").append('<div class="form-group form-group-meta-tags-quiz"><label for="meta_tags" class="col-sm-2 control-label">Meta_tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" placeholder="Meta_tag"></div><a><button id="addmetatagstoquiz" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="difficulty" class="col-sm-2 control-label">Difficulty</label><div class="col-sm-10"><input type="text" class="form-control" id="difficulty" name="difficulty" placeholder="Difficulty, from 1-20"></div></div>');

            for (var y = 0; y < 3; y++){
            $(".form-horizontal").append('<hr>');
            $(".form-horizontal").append('<h4>Question ' + (y+1) + '</h4>');
            $(".form-horizontal").append('<div class="form-group"><label for="question' + (y+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (y+1) + '" name="questions[' + y + '][text]" placeholder="Text"></div></div>');
            $(".form-horizontal").append('<div class="form-group" alt="' + y + '"><label for="answerchoice' + (y+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (y+1) + '" name="questions[' + y + '][answers][]" placeholder="Answer Choice"></div><a><button id="addchoicestoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Choice!</button></a></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (y+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (y+1) + '" name="questions[' + y + '][correct_answer]" placeholder="Correct Answer (# of the array spot; i.e 0,1,2,3...)"></div></div>');
            $(".form-horizontal").append('<div class="form-group" alt="' + y + '"><label for="meta_tags' + (y+1) + '" class="col-sm-2 control-label">Meta_tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (y+1) + '" name="questions[' + y + '][meta_tags][]" placeholder="Meta_tag"></div><a><button id="addmetatagstoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
            altholder = y+1;
        }
            $("#interface").append('<center><a><button id="addquestions" type="button" class="btn btn-info btn-lg"><i class="icon-plus-sign"></i> Add more Questions</button></a></center>')
            $("#interface").append('<br>')
            $("#interface").append('<center><a href="/"><button id="makequizbutton" type="button" class="btn btn-success btn-lg"><i class="icon-upload-alt"></i> Make your quiz!</button></a></center>')
    });

    $("#container3").on("click", "#addmetatagstoquiz", function(){ //when the user wants to add more metatags to the quiz during the creation process
        $(".form-group-meta-tags-quiz").append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" placeholder="Meta_tag"></div>');
    });
    $("#container3").on("click", "#addmetatagstoquestion", function(){ //when the user wants to add more metatags to questions during the creation process
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][meta_tags][]" placeholder="Meta_tag"></div>');
    });
    $("#container3").on("click", "#addchoicestoquestion", function(){ //when the user wants to add more answer choices to questions during the creation process
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][answers][]" placeholder="Answer Choice"></div>');
    });
    $("#container3").on("click", "#addquestions", function() {
        $(".form-horizontal").append('<hr>');
        $(".form-horizontal").append('<h4>Question ' + (altholder+1) + '</h4>');
        $(".form-horizontal").append('<div class="form-group"><label for="question' + (altholder+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (altholder+1) + '" name="questions[' + altholder + '][text]" placeholder="Text"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + altholder + '"><label for="answerchoice' + (altholder+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (altholder+1) + '" name="questions[' + altholder + '][answers][]" placeholder="Answer Choice"></div><a><button id="addchoicestoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Choice!</button></a></div>');
        $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (altholder+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (altholder+1) + '" name="questions[' + altholder + '][correct_answer]" placeholder="Correct Answer (# of the array spot; i.e 0,1,2,3...)"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + altholder + '"><label for="meta_tags' + (altholder+1) + '" class="col-sm-2 control-label">Meta_tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (altholder+1) + '" name="questions[' + altholder + '][meta_tags][]" placeholder="Meta_tag"></div><a><button id="addmetatagstoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
        altholder++;
    });
    $("#container3").on("click", "#makequizbutton", function() { //the submit button for the quiz creation process.
        var makequizformdata = $("form#makequiz").serializeObject();
        console.log(makequizformdata);
        for (var e = 0; e < makequizformdata.questions.length; e++){ // i do this to fill in the missing parts of the json!
            makequizformdata.questions[e].global_correct = 0;
            makequizformdata.questions[e].global_total = 0;
        }
        $.ajax({
          method: "POST",
          url: "/quiz",
          data: makequizformdata
        })
    });
    
    
    
    
    
///////// Edit Functionality ///////////
     var altholderforedit = 0;
     var deletes=0
    $(".edit").click(function() { //This is the response for the edit drop down menu.
        
        $.ajax({
                url: "/quiz/" + $(this).attr("alt"),
                dataType: "text",
                success: function(data) {
                    quizedit = $.parseJSON(data);
                    console.log(quizedit);
                },
                async: false
        });
        
            $("#Login").hide();
             $("#menucontainer").hide();
            $('#container2').show();
            $("#container2").empty(); //clears the container HTML div so i can make new stuff in it
            $("#container2").append("<h1>Edit Away!</h1>").hide().fadeIn(1000); //fadeIn all new HTML
            $("#container2").append("<h4> Note: The correct answer field takes a numermical value that corresponds to the correct answer's position in an array. The first item in any array is at a position of zero and all subsequent items' positions count up by one!</h4>");
            $("#container2").append("<div class=\"col-md-8 col-md-offset-2 choices radio\" id=\"interface\">"); //making a dynamic div
            $("#interface").append("<form id='editquiz' class='form-horizontal'>");  
             $(".form-horizontal").append('<div class="form-group"><label for="title" class="col-sm-2 control-label">Title</label><div class="col-sm-10"><input type="text" class="form-control" id="title" name="title" value="' + quizedit.title + '"placeholder="Title"></div></div>');
            $(".form-horizontal").append('<div class="form-group"><label for="description" class="col-sm-2 control-label">Description</label><div class="col-sm-10"><textarea rows="2" class="form-control" id="description" name="description" placeholder="Description">' + quizedit.description + '</textarea></div></div>');

            $(".form-horizontal").append('<div class="form-group form-group-meta-tags-quiz"><label for="meta_tags" class="col-sm-2 control-label">Meta Tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" value="' + quizedit.meta_tags[0] + '"placeholder="Meta_tag"></div><a><button id="addmetatagstoquizedit" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
            for (var metatagsforquiz = 1; metatagsforquiz < quizedit.meta_tags.length; metatagsforquiz++){
            $(".form-group-meta-tags-quiz").append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="meta_tags[]" value="' + quizedit.meta_tags[metatagsforquiz] + '" placeholder="Answer Choice"></div>');
            }
            $(".form-horizontal").append('<div class="form-group"><label for="difficulty" class="col-sm-2 control-label">Difficulty</label><div class="col-sm-10"><input type="text" class="form-control" id="difficulty" name="difficulty" value="' + quizedit.difficulty + '" placeholder="Difficulty, from 1-20"></div></div>');

            for (var y = 0; y < quizedit.questions.length; y++){
            $(".form-horizontal").append('<hr>');
            $(".form-horizontal").append('<h4>Question ' + (y+1) + '</h4>');
                
                
            $(".form-horizontal").append('<div class="form-group"><label for="question' + (y+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (y+1) + '" name="questions[' + y + '][text]" value="' + quizedit.questions[y].text + '" placeholder="Text"></div></div>');

            $(".form-horizontal").append('<div class="form-group" id="question' + y + '" alt="' + y + '"><label for="answerchoice' + (y+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (y+1) + '" name="questions[' + y + '][answers][]" value="' + quizedit.questions[y].answers[0] + '" placeholder="Answer Choice"></div><a><button id="addchoicestoquestionedit" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Choice!</button></a></div>');
            for (var questionsforquiz = 1; questionsforquiz < quizedit.questions[y].answers.length; questionsforquiz++){
            $("#question" + y).append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $("#question" + y).attr("alt") + '][answers][]" value="' + quizedit.questions[y].answers[questionsforquiz] + '" placeholder="Answer Choice"></div>');
            }

            $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (y+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (y+1) + '" name="questions[' + y + '][correct_answer]" value="' + quizedit.questions[y].correct_answer + '" placeholder="Correct Answer (# of the array spot; i.e 0,1,2,3...)"></div></div>');

            $(".form-horizontal").append('<div class="form-group" id="metatagforquestion' + y + '" alt="' + y + '"><label for="meta_tags' + (y+1) + '" class="col-sm-2 control-label">Meta Tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (y+1) + '" name="questions[' + y + '][meta_tags][]" value="' + quizedit.questions[y].meta_tags[0] + '" placeholder="Meta_tag"></div><a><button id="addmetatagstoquestionedit" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Metatag!</button></a></div>');
            for (var metatagsforquestions = 1; metatagsforquestions < quizedit.questions[y].meta_tags.length; metatagsforquestions++){
            $("#metatagforquestion" + y).append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $("#question" + y).attr("alt") + '][meta_tags][]" value="' + quizedit.questions[y].meta_tags[metatagsforquestions] + '" placeholder="Meta_tag"></div>');
            }

            altholderforedit = y+1;
        }
            $("#interface").append('<center><a><button id="addquestionsedit" type="button" class="btn btn-info btn-lg.round"><i class="icon-plus-sign"></i><center>Add more Questions</center></button></a></center>')
            $("#interface").append('<center><a><button id="deletequestionedit" type="button" class="btn btn-info btn-lg.round"><i class="icon-plus-sign"></i> Delete Questions</button></a></center>')
            $("#interface").append('<br>')
            $("#interface").append('<center><a href="/"><button id="editquizbutton" type="button" class="btn btn-primary btn-lg.round nav pull-left"><i class="icon-upload-alt" vertical-align: middle></i>Submit Edited Quiz</button></a></center>')
    });
 

    
    $("#container2").on("click", "#addmetatagstoquizedit", function(){ //when the user wants to add more metatags to the quiz during the creation process
        $(".form-group-meta-tags-quiz").append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags[]" name="meta_tags" placeholder="Meta_tag"></div>');
    });
    
    $("#container2").on("click", "#addmetatagstoquestionedit", function(){ //when the user wants to add more metatags to questions during the creation process
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][meta_tags][]" placeholder="Meta_tag"></div>');
    });
    $("#container2").on("click", "#addchoicestoquestionedit", function(){ //when the user wants to add more answer choices to questions during the creation process
        $(this).parent().parent().append('<div class="col-sm-offset-2 col-sm-8"><input type="text" class="form-control" id="meta_tags" name="questions[' + $(this).parent().parent().attr("alt") + '][answers][]" placeholder="Answer Choice"></div>');
    });
    $("#container2").on("click", "#addquestionsedit", function() {
        $(".form-horizontal").append('<hr>');
        $(".form-horizontal").append('<h4>Question ' + (altholderforedit+1) + '</h4>');
        $(".form-horizontal").append('<div class="form-group"><label for="question' + (altholderforedit+1) + '" class="col-sm-2 control-label">Text </label><div class="col-sm-10"><input type="text" class="form-control" id="text' + (altholderforedit+1) + '" name="questions[' + altholderforedit + '][text]" placeholder="Text"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + altholderforedit + '"><label for="answerchoice' + (altholderforedit+1) + '" class="col-sm-2 control-label">Answer Choices</label><div class="col-sm-8"><input type="text" class="form-control" id="answerchoice' + (altholderforedit+1) + '" name="questions[' + altholderforedit + '][answers][]" placeholder="Answer Choice"></div><a><button id="addchoicestoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Choice!</button></a></div>');
        $(".form-horizontal").append('<div class="form-group"><label for="correctanswer' + (altholderforedit+1) + '" class="col-sm-2 control-label">Correct Answer</label><div class="col-sm-10"><input type="text" class="form-control" id="correctanswer' + (altholderforedit+1) + '" name="questions[' + altholderforedit + '][correct_answer]" placeholder="Correct Answer (# of the array spot; i.e 0,1,2,3...)"></div></div>');
        $(".form-horizontal").append('<div class="form-group" alt="' + altholderforedit + '"><label for="meta_tags' + (altholderforedit+1) + '" class="col-sm-2 control-label">Meta_tags</label><div class="col-sm-8"><input type="text" class="form-control" id="meta_tags' + (altholderforedit+1) + '" name="questions[' + altholderforedit + '][meta_tags][]" placeholder="Meta_tag"></div><a><button id="addmetatagstoquestion" type="button" class="btn btn-info btn-sm"><i class="icon-plus-sign"></i> Add Meta tag!</button></a></div>');
        altholderforedit++;
    });
    
    $("#container2").on("click", '#deletequestionedit', function() {
        console.log(quizedit);
       quizedit.questions.splice(altholderforedit-1, 1);
        altholderforedit--;
        deletes++;
        $("#deletequestionedit").html('Delete a Question! # of  Pending Deleted Questions: '+deletes+"");
        });
    $("#container2").on("click", "#editquizbutton", function() { //the submit button for the quiz creation process.
        var editquizformdata = $("form#editquiz").serializeObject();
        console.log(editquizformdata);
        if (editquizformdata.questions.length <= quizedit.questions.length){
        for (var d = 0; d < editquizformdata.questions.length; d++){ // i do this to fill in the missing parts of the json!
            editquizformdata.questions[d].global_correct = quizedit.questions[d].global_correct;
            editquizformdata.questions[d].global_total = quizedit.questions[d].global_total;
            }
        }
        else {
        for (var g = 0; g < quizedit.questions.length; g++){
            editquizformdata.questions[g].global_correct = quizedit.questions[g].global_correct;
            editquizformdata.questions[g].global_total = quizedit.questions[g].global_total;
            }
        for (var p = quizedit.questions.length; p < editquizformdata.questions.length; p++){
            editquizformdata.questions[p].global_correct = 0;
            editquizformdata.questions[p].global_total = 0;
        }
        }
        
        editquizformdata.id = quizedit.id;
        var thingstosend = JSON.stringify(editquizformdata);
        
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