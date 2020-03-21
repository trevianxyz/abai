console.log("Hello from discover.js");

function cb() {
    var c = document.getElementById('disc-img');
    var ctx = c.getContext('2d');
    var img = document.getElementById('img1');
    ctx.drawImage(img, 10, 10);
}

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    cb();
} else {
    document.addEventListener("DOMContentLoaded", cb);
}