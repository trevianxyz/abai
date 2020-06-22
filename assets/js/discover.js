console.log("Hello from discover.js");

class Canvas {

    constructor(elem) {
        this._elem = typeof elem == 'string' ? document.getElementById(elem) : elem;

        this._ctx = this._elem.getContext('2d');
        this._ctx.imageSmoothingEnabled = false;
        this._ctx.webkitImageSmoothingEnabled = false;
        this._ctx.mozImageSmoothingEnabled = false;

        this._text = "";

        this._ctx.strokeStyle = 'black';
        this._ctx.fillStyle = 'white';
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
        // this._ctx.beginPath();
        // this._ctx.rect(...this._textRectArr);
        // this._ctx.stroke();

        this._ctx.shadowOffsetX = -5;
        this._ctx.shadowOffsetY = 5;
        this._ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
        this._ctx.shadowBlur = 4;  

        this._fontSize = 60;
        this._ctx.font = "60px Arial";
        this._ctx.fillStyle = "white";
       
        this.drawText();
    }

    drawText() {
        var words = this._text.split(' ');
        var line = '';
        
        var x = this._textRect.x;
        var y = this._textRect.y + this._fontSize;
        var w = this._textRect.x + this._textRect.w;
        var lineHeight = this._fontSize + 5;
        
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = this._ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > w && n > 0) {
                //this._ctx.strokeText(line, x, y);
                this._ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        //this._ctx.strokeText(line, x, y);
        this._ctx.fillText(line, x, y);
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

}

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