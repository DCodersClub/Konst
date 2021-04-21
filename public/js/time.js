const start = new Date("April 30, 2021 12:00:00 GMT+0530");
const end = new Date("April 30, 2021 18:00:00 GMT+0530");

let updateInterval = 100;
let diff = 0.0;

diff = getCurrentDiff(start);
updateTimer(diff);
setInterval(function () {
  if (getCurrentDiffMillis(end) >= 0) {
    updateInterval = 99999;
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

function millisToMinutesAndSeconds(millis) {
  var hours = Math.floor(millis / 3600000);
  var mins = Math.floor(Math.floor(millis % 3600000) / 60000);
  var seconds = (
    Math.floor(Math.floor(millis % 3600000) % 60000) / 1000
  ).toFixed(0);
  //ES6 interpolated literals/template literals
  //If seconds is less than 10 put a zero in front.
  return pad(hours, 2) + ":" + pad(mins, 2) + ":" + pad(seconds, 2);
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
