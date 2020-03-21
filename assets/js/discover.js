console.log("Hello from discover.js");

function cb() {
    var c = document.getElementById('disc-img');
    var ctx = c.getContext('2d');
    var img = document.getElementById('img1');
    ctx.drawImage(img, 10, 10);
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("he looq", 20, 50);
}

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    cb();
} else {
    document.addEventListener("DOMContentLoaded", cb);
}