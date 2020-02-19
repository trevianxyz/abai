console.log("Hello from words.js");

function getCurrent() {
    return document.querySelector('.words-chapter-current');
}

function getNext() {
    return getCurrent().nextElementSibling;
}

function get(num) {
    id = 'w' + num;
    return document.getElementById(id);
}

function activate(e) {
    if (typeof(e) == 'number') {
        e = get(e);
    } 

    curr = getCurrent();
    animateCSS(curr, 'fadeOut', function() {
        curr.classList.remove('words-chapter-current')
    })
    animateCSS(e, 'fadeIn', function() {
        e.classList.add('words-chapter-current')
    })
    
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
};
  
if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    cb();
} else {
    document.addEventListener("DOMContentLoaded", cb);
}

