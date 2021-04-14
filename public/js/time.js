const start = new Date("April 15, 2021 12:00:00");
const updateInterval = 100;
let diff = 0.0;

diff = getCurrentDiff(start);
updateTimer(diff);
setInterval(function () {
  diff = getCurrentDiff(start);
  updateTimer(diff);
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
