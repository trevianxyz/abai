// filter functions
var filterFns = {
  // show if number is greater than 50
  numberGreaterThan50: function() {
    var number = $(this).find('.number').text();
    return parseInt( number, 10 ) > 50;
  },
  // show if name ends with -ium
  ium: function() {
    var name = $(this).find('.name').text();
    return name.match( /ium$/ );
  }
};

var newsEventHandlers = function() {
  var $grid = $('.element-grid').isotope({
    itemSelector: '.element-item',
    layoutMode: 'fitRows',
    getSortData: {
      category: '[data-category]'
    }
  });
  // bind filter button click
  $('#filters li').on('click', '.news-filter', function() {
    var filterValue = $(this).attr('data-filter');
    var title = $(this).text();

    if (title === 'All Media') {
      title = 'News';
    }

    $('#news').html(title);
    // use filterFn if matches value
    filterValue = filterFns[ filterValue ] || filterValue;
    $grid.isotope({ filter: filterValue });
  });
}
