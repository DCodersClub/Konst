const currentPath = window.location.pathname;

switch (currentPath) {
  case "/":
    makeActive(".home");
    break;
  case "/user/login":
    makeActive(".login");
    break;
  case "/user/profile":
    makeActive(".profile");
    break;
  case "/rules":
    makeActive(".rules");
    break;
  case "/about":
    makeActive(".about");
    break;
  case "/announcement":
    makeActive(".annoucements");
    break;
  case "/leaderboard":
    makeActive(".leaderboard");
    break;
}

function makeActive(navElement) {
  $(navElement).addClass("is-active");
}
