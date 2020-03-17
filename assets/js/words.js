console.log("Hello from words.js");

function getCurrent() {
    return document.querySelector('.words-chapter-current');
}

function getNext() {
    let curr =  getCurrent();
    if (curr.id == 'w45') {
        return curr;
    } else {
        return curr.nextElementSibling;
    }
}

function getPrev() {
    let curr =  getCurrent();
    if (curr.id == 'w1') {
        return curr;
    } else {
        return curr.previousElementSibling;
    }
}

function get(num) {
    id = 'w' + num;
    return document.getElementById(id);
}

function activate(e) {
    console.log('activating ' + e)
    if (typeof(e) == 'number') {
        e = get(e);
    } 

    curr = getCurrent();
    animateCSS(curr, 'fadeOut', function() {
        curr.classList.remove('words-chapter-current')
        e.classList.add('words-chapter-current')
    })

    animateCSS(e, 'fadeIn')
    
}

function killSelection() {
    console.log("blank selection, killing")
}

function handleNewSelection(sel) {
    console.log(sel);
    console.log(sel.anchorNode);
    //console.log(sel.toString());
    sel.anchorNode.dataset.toggle = "tooltip";
    sel.anchorNode.dataset.title = "YEET BITCHES";
}

function animateCSS(element, animationName, callback) {
    var node;

    if (typeof(element) == "string") {
      node = document.querySelector(element)
    } else {
      node = element;
    }

    node.classList.add('animated', animationName, 'faster')

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName, 'faster')
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}

var cb = function() {
    var rand = document.querySelectorAll('.w-random')
    rand.forEach(function(r) {
        r.addEventListener('click', function() {
            console.log("random button clicked")
            activate(Math.floor(Math.random() * 44) + 1);
        })
    });

    var next = document.querySelectorAll('.w-right')
    next.forEach(function(n) {
        n.addEventListener('click', function() {
            next = getNext()
            activate(next)
        })
    })

    var prev = document.querySelectorAll('.w-left')
    prev.forEach(function(p) {
        p.addEventListener('click', function() {
            prev = getPrev()
            activate(prev)
        })
    })

    var box = document.querySelectorAll('input.w-page-input')
    box.forEach(function(b) {
        b.addEventListener('change', function(i) {
            val = parseInt(i.target.value)
            if (typeof(val) == 'number' && !isNaN(val)) {
                activate(val)
            } else {
                i.target.value = getCurrent().id.slice(1);
            }
        })
    })

    let selection;

    document.onselectionchange = function() {
        console.log('new selection made');

        selection = document.getSelection();

        if (selection.toString() === "") {
            killSelection();
        } else {
            handleNewSelection(selection);
        }
        
    };
};
  
if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    cb();
} else {
    document.addEventListener("DOMContentLoaded", cb);
}

