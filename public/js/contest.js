var questions = [];
var currentIndex = 1;
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
    if(!unlockedPages.includes(pageNumber)){
    unlockedPages.push(pageNumber);
    }
    pageNumber-=1;
    currentIndex = pageNumber;
    $(".question-number").html(questions[pageNumber].index);
    $(".question").html(questions[pageNumber].question);
    console.log(questions[pageNumber].question);
}

function submitAnswer(){
    if(solved.includes(currentIndex)){
        return;
    }

    if($(".answer-field").val() == questions[currentIndex].answer){
        solved.push(currentIndex);
        unlockNextPages(currentIndex+1);
    }
}

function unlockNextPages(current){
    var toUnlock = 2;

    for(var i=current;i<=10;i++){
        console.log(i);
        if(toUnlock==0){
            break;
        }
        else if (unlockedPages.includes(i)){
            continue;
        }
        else
        {
            unlockedPages.push(i);
            toUnlock-=1;
        }
    }

    unlockedPages.forEach((page)=>{
        $("."+page).removeClass("link-disabled");
        $("."+page).addClass("link-active");
    });
}

