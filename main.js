
// fetch information using backbone//
var Question = Backbone.Model.extend({
  initialize: function () {
  },
  defaults: {
    id: null,
    question: null,
    answers: null,
    correct: null
  }
});
var Questions = Backbone.Collection.extend({
    model: Question,
    url: "/data.json"
});

var questionsCollection = new Questions();


var answered = [];

var counter = 0;
var Router = Backbone.Router.extend({
    initialize: function (){
      Backbone.history.start({ pushState: true});
    },

    routes: {
      "": "index"
    },

    index: function(){
        questionsCollection.fetch({
            success: function(resp){
                var data = {"questions": resp.toJSON()};
                var template = $("#questionTemplate").text();
                var info = Mustache.render(template, data);
                $("#content-wrapper").html(info);
 
                $('input[type="radio"]').click(function(e){
                        counter +=1;
                        console.log(counter);
                        if(counter >5){
                          $("body").toggle("#overlay");
                        }
                    var name = $(this).attr('name');
                    var parentList = $(this).parents('ul');

                    $('input[name=' + name + ']').attr('disabled', true);

                    var questionId = $(this).data('questionid');

                    question = data.questions.filter(function(question){
                        return question.id == questionId;
                    })[0];
                    if (question){
                        var answer = $(this).val();
                        var correctAnswer = question.answers[question.correct];



                        if (answer == correctAnswer) {
                            addAnswers(question, true);
                            parentList.addClass('correct');
                            $("#results").html("YOU ARE RIGHT!");    
                        } else{
                            addAnswers(question, false);
                            parentList.addClass('incorrect');
                           
                            $("#results").html("YOU NEED TO STUDY!");
                        }
                    }

                    
                })

            }, error: function (err){
              console.log("error:", err);
            }
        });
    }
});

function addAnswers (question, correct) {
    var alreadyAnswered = false;
    var answerObj = {};
    answered.forEach(function(answer){
        if (answer.qid === question.id) {
            alreadyAnswered = true;
        }
    });
    if (!alreadyAnswered) {
        answerObj['q' + question.id] = correct;
        answered.push(answerObj);
    }
    console.log(answered);
}

var router = new Router();
/*
variable that countes it is RIGHT/ global variable initialize to 
cero , increment by one
question  id if they have that right.

*/