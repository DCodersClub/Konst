const currentPath = window.location.pathname;

switch(currentPath){
    case "/" : makeActive(".home");break;
    case "/user/login" : makeActive(".login");break;
    case "/user/profile" : makeActive(".profile");break;
}


function makeActive(navElement){
    $(navElement).addClass('is-active');
}