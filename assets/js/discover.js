console.log("Hello from discover.js");

class Canvas {

    constructor(elem) {
        this._elem = typeof elem == 'string' ? document.getElementById(elem) : elem;
        this._ctx = this._elem.getContext('2d');
    }

    get bg() {
        return this._bg;
    }

    set bg(img) {
        this._bg = typeof img == 'string' ? document.getElementById(img) : img;
        this.redraw();
    }

    redraw() {
        this._ctx.drawImage(this._bg, 0, 0);
    }

}





function cb() {
    var c = new Canvas('disc-img');
    c.bg = 'img1';

    // var c = document.getElementById('disc-img');
    // setDPI(c, 192);
    // var ctx = c.getContext('2d');
    // var img = document.getElementById('img1');
    // ctx.drawImage(img, 10, 10);
    // ctx.fillStyle = "blue";
    // ctx.fillRect(0, 0, c.width, c.height);
    // ctx.font = "18px Arial";
    // ctx.fillStyle = "black";
    // ctx.fillText("You are a little brick in the wall of the world. Find your place in it!", 20, 50);
}

function setDPI(canvas, dpi) {
    // Set up CSS size.
    canvas.style.width = canvas.style.width || canvas.width + 'px';
    canvas.style.height = canvas.style.height || canvas.height + 'px';

    // Resize canvas and scale future draws.
    var scaleFactor = dpi / 96;
    canvas.width = Math.ceil(canvas.width * scaleFactor);
    canvas.height = Math.ceil(canvas.height * scaleFactor);
    var ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
}

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    cb();
} else {
    document.addEventListener("DOMContentLoaded", cb);
}

