console.log("Hello from discover.js");

class Canvas {

    constructor(elem) {
        this._elem = typeof elem == 'string' ? document.getElementById(elem) : elem;

        this._ctx = this._elem.getContext('2d');
        this._ctx.imageSmoothingEnabled = false;
        this._ctx.webkitImageSmoothingEnabled = false;
        this._ctx.mozImageSmoothingEnabled = false;

        this._text = "";
    }

    get bg() {
        return this._bg;
    }

    set bg(img) {
        this._bg = typeof img == 'string' ? document.getElementById(img) : img;
        
        // handle dpi
        // this will break for images by file
        // handle this shit before you implement that
        let scaleFactor = document.getElementById(img).width / document.getElementById('disc-img').width;
        this._elem.width = Math.ceil(this._elem.width * scaleFactor);
        this._elem.height = Math.ceil(this._elem.height * scaleFactor);
  
        let s = this._bg.dataset.textRect;
        let a = s.split(', ');
        a = a.map((n) => parseInt(n));

        this._textRectArr = a;
        this._textRect = {
            x: a[0],
            y: a[1],
            w: a[2],
            h: a[3]
        };

        this.redraw();
    }

    get text() {
        return this._text;
    }

    set text(t) {
        this._text = t;
        this.redraw();
    }

    redraw() {
        this._ctx.drawImage(this._bg, 0, 0);

        this._ctx.strokeStyle = 'white';
        this._ctx.beginPath();
        this._ctx.rect(...this._textRectArr);
        this._ctx.stroke();

        this._ctx.font = "18px Arial";
        this._ctx.fillStyle = "white";
       
        this._ctx.fillText(this._text, this._textRect.x, this._textRect.y + 18);
    }

}





function cb() {
    var c = new Canvas('disc-img');
    c.bg = 'img1';

    document.querySelectorAll('.disc-result').forEach( (r) => r.addEventListener('click', function(e) {
            c.text = this.firstElementChild.innerText;
            this.classList.contains('disc-result-active') ? clearActives() : (clearActives(), this.classList.add('disc-result-active'));
        })
    );

    document.querySelector('.disc-btn-addtext').addEventListener('click', function(e) {
        document.getElementById('disc-results').classList.add('disc-results-addtext-open');
        document.getElementById('disc-addtext').classList.remove('d-none');
        document.getElementById('disc-addtext-btn-submit').addEventListener('click', () => addNewQuote(c));
    });

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

// function setDPI(canvas, dpi) {
//     // Set up CSS size.
//     canvas.style.width = canvas.style.width || canvas.width + 'px';
//     canvas.style.height = canvas.style.height || canvas.height + 'px';

//     // Resize canvas and scale future draws.
//     var scaleFactor = dpi / 96;
//     canvas.width = Math.ceil(canvas.width * scaleFactor);
//     canvas.height = Math.ceil(canvas.height * scaleFactor);
//     var ctx = canvas.getContext('2d');
//     ctx.scale(scaleFactor, scaleFactor);
// }

function clearActives() {
    document.querySelectorAll('.disc-result-active').forEach( (e) => e.classList.remove('disc-result-active'));
}

// Handles adding a new quote from the addtext dialog.
// The most impure function I've ever written.
function addNewQuote(c) {
    let newQuote = document.getElementById('disc-addtext-input').value;

    if (newQuote === undefined || newQuote === null || newQuote.length < 1 || newQuote === "") {
        return;
    }

    let res = document.getElementById('disc-results');
    let fq = document.querySelector('.disc-result.is-first')
    let nq = getQuoteMarkup(newQuote);

    res.insertBefore(nq, fq);

    fq.classList.remove('is-first');
    nq.classList.add('is-first');

    c.text = newQuote;

    clearActives()
    nq.classList.add('disc-result-active');

    nq.addEventListener('click', function(e) {
        c.text = this.firstElementChild.innerText;
        this.classList.contains('disc-result-active') ? clearActives() : (clearActives(), this.classList.add('disc-result-active'));
    });

    document.getElementById('disc-results').classList.remove('disc-results-addtext-open');
    document.getElementById('disc-addtext').classList.add('d-none');
}

function getQuoteMarkup(text) {
    m = document.createElement('div');
    m.classList.add('disc-result');
    m.dataset.addedResult = true;
    m.innerHTML = `<div class="disc-result-text">
                        "${text}"
                    </div>`;

    return m;
}

window.addEventListener('load', cb);