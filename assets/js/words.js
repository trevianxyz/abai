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

