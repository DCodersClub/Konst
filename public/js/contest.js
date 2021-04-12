var questions = [];
var currentIndex = 1;
var solved = [];
var unlockedPages = [1];

$(document).on("click", ".question-list li", function (event) {
  if (unlockedPages.includes(parseInt(event.target.innerHTML))) {
    loadPage($(this).html());
  }
});

$.get("/contest/questions", function handleData(data) {
  data.questions.forEach((question) => {
    questions.push({
      index: question.index,
      question: question.question,
      answer: question.answer,
    });
  });
  solved = data.solved;
  unlockFromSolved();
  loadPage(1);
});

function loadPage(pageNumber) {
  if (!unlockedPages.includes(pageNumber)) {
    unlockedPages.push(pageNumber);
  }
  pageNumber -= 1;
  currentIndex = pageNumber;
  $(".question-number").html(questions[pageNumber].index);
  $(".question").html(questions[pageNumber].question);
  if (solved.includes(pageNumber)) {
    $(".answer-field").attr("disabled", true);
    $(".submit-button").addClass("disabled");
    $(".messages").html('<h6 class="success-message">solved</h6>');
  } else {
    $(".answer-field").attr("disabled", false);
    $(".submit-button").removeClass("disabled");
    $(".messages").html("");
  }
}

function submitAnswer() {
  if (solved.includes(currentIndex)) {
    return;
  }

  if ($(".answer-field").val() == questions[currentIndex].answer) {
    $.post(
      "/contest/success",
      { questionIndex: questions[currentIndex].index },
      function (res) {
        console.log(res);
      }
    );
    solved.push(currentIndex);
    $(".answer-field").attr("disabled", true);
    $(".submit-button").addClass("disabled");
    $(".messages").html('<h6 class="success-message">solved</h6>');
    unlockNextPages(currentIndex + 1);
  }
}

function unlockNextPages(current) {
  var toUnlock = 2;

  for (var i = current; i <= 10; i++) {
    if (toUnlock == 0) {
      break;
    } else if (unlockedPages.includes(i)) {
      continue;
    } else {
      unlockedPages.push(i);
      toUnlock -= 1;
    }
  }

  unlockedPages.forEach((page) => {
    $("." + page).removeClass("link-disabled");
    $("." + page).addClass("link-active");
  });
}

function unlockFromSolved(){
    var lastQuestionSolved = solved.reduce(function(a, b) { return Math. max(a, b); });
    solved.forEach((page)=>{
        unlockNextPages(page+1);
    });

}




// setInterval(function updateTimer(){
//     diff.getSeconds
// },1000)