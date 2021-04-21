const start = new Date("April 30, 2021 12:00:00 GMT+0530");
const end = new Date("April 30, 2021 18:00:00 GMT+0530");

const updateInterval = 100;
let diff = 0.0;

diff = getCurrentDiff(start);

if (getCurrentDiffMillis(start) <= 0) {
  $(".compete").hide();
  $(".leaderboard-button").hide();
} else {
  $(".register").hide();
  $(".leaderboard-button").hide();
  $(".timer-text").html("STARTED: <span class='timer'></span> AGO");
}

if (getCurrentDiffMillis(end) >= 0) {
  $(".register").hide();
  $(".compete").hide();
  $(".leaderboard-button").show();
  $(".timer-text").html('<span class="timer">THE CONTEST HAS ENDED</span>');
}

updateTimer(diff);
setInterval(function () {
  diff = getCurrentDiff(start);
  updateTimer(diff);
}, 1000);

function getCurrentDiffMillis(start) {
  const currentDate = new Date();
  let diff = currentDate - start;
  return diff;
}

function getCurrentDiff(start) {
  const currentDate = new Date();
  let diff = currentDate - start;
  return millisToMinutesAndSeconds(diff);
}

function updateTimer(time) {
  if (getCurrentDiffMillis(end) >= 0) {
    $(".timer-text").html('<span class="timer">THE CONTEST HAS ENDED</span>');
  } else {
    $(".timer").html(time);
  }
}

function millisToMinutesAndSeconds(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  hrs = Math.abs(hrs);
  mins = Math.abs(mins);
  secs = Math.abs(secs);
  return pad(hrs) + " hours " + pad(mins) + " mins " + pad(secs) + " seconds";
}

function pad(num) {
  padding = num < 10 ? "0" + num : num;
  return "" + padding;
}
