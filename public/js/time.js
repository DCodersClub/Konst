const start = new Date("April 30, 2021 12:00:00 GMT+0530");
const end = new Date("April 30, 2021 18:00:00 GMT+0530");

let updateInterval = 100;
let diff = 0.0;

diff = getCurrentDiff(start);
updateTimer(diff);
var update = setInterval(function () {
  if (getCurrentDiffMillis(end) >= 0) {
    clearInterval(updateTimer);
    alert("Contest has ended");
    window.location.href = "/leaderboard";
  } else {
    diff = getCurrentDiff(start);
    updateTimer(diff);
  }
}, 1000);

function getCurrentDiff(start) {
  const currentDate = new Date();
  let diff = currentDate - start;
  return millisToMinutesAndSeconds(diff);
}

function updateTimer(age) {
  $(".timer").html(age);
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
  return pad(hrs, 2) + ":" + pad(mins, 2) + ":" + pad(secs, 2);
}

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getCurrentDiffMillis(start) {
  const currentDate = new Date();
  let diff = currentDate - start;
  return diff;
}
