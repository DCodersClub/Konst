var questions = [];
var currentPage;
var solved = [];
var unlockedPages = [1];

$(document).on("click",".question-list li", function (event) {
    if(unlockedPages.includes(parseInt(event.target.innerHTML))){
        loadPage($(this).html());
    }
});


$.get("/contest/questions",function handleData(data){
    data.forEach((question)=>{
        questions.push({
            index:question.index,
            question:question.question,
            answer:question.answer,
        });
    });
    loadPage(1);
});


function loadPage(pageNumber){
    unlockedPages.push(pageNumber);
    pageNumber-=1;
    currentPage = pageNumber;
    $(".question-number").html(questions[pageNumber].index);
    $(".question").html(questions[pageNumber].question);
    console.log(questions[pageNumber].question);
}

function submitAnswer(){
    if(solved.includes(currentPage)){
        return;
    }

    if($(".answer-field").val() == questions[currentPage].answer){
        solved.push(currentPage);
        unlockNextPages(currentPage);
    }
}

function unlockNextPages(current){
    var toUnlock = 2;

    for(var i=current;i<=10;i++){
        if(toUnlock==0){
            break;
        }
        if (unlockedPages.includes(i)){
            continue;
        }
        else{
            unlockedPages.push(i);
            toUnlock-=1;
        }
    }

    unlockedPages.forEach((page)=>{
        $("."+page).removeClass("link-disabled");
        $("."+page).addClass("link-active");
    });
}

