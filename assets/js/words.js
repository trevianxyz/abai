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

function constructTooltipText(sel) {
    let word = getCurrent().id.substr(1);
    console.log(word);
    let text = sel.toString();
    let twText = text;

    if (text.length > 170) {
        twText = text.slice(0, 170);
        twText = twText + "…";
    }

    twText = encodeURI(twText);
    discText = encodeURI(text);

    return `<a href="https://twitter.com/intent/tweet?text=%22${twText}%22%20%0A%0A%E2%80%94Abai%20Kunanbaiuly,%20%22Book%20of%20Words%22%0A%0AFor%20more,%20go%20to%20http%3A//abaicenter.com/about-abai/book-of-words?w=${word}"><i class="fab fa-twitter"></i></a> | ` + 
        '<a href="/discover?text=' + discText + '"><i class="fas fa-edit"></i></a>';
}

function constructTooltip(node, sel) {
    node.dataset.activeTooltip = "true";
    node.dataset.toggle = "tooltip";
    node.dataset.html = "true";
    node.dataset.trigger = "manual";
    node.dataset.placement = "top";
    node.dataset.title = constructTooltipText(sel);
}

function killSelection() {
    console.log("blank selection, killing tooltips");
    document.querySelectorAll('[data-active-tooltip="true"]')
        .forEach((e) => {
            e.dataset.activeTooltip = "false";
            e.dataset.title = "";
        });
    $('[data-toggle="tooltip"]').tooltip('dispose');
}

function handleNewSelection(sel) {
    let parent = sel.anchorNode.parentNode;

    constructTooltip(parent, sel);
    
    $('[data-active-tooltip="true"]').tooltip('hide')
        .attr('data-original-title', constructTooltipText(sel))
        .tooltip('show'); 
    

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
    var paramWord = (new URL(document.location)).searchParams.get('w');
    if (paramWord && paramWord > 0 && paramWord <= 45) {
        activate(parseInt(paramWord));
    }

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

