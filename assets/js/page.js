
function whichState() {
  $('#which-state').change(function(){
    console.log($(this).val());
    $('.card-residency').removeClass('active');
    $('#card-'+$(this).val()).addClass('active');
  });
}

function dynamicPages() {
  var slug = document.location.hash; // #page-[contentType]-[id

  if (!slug) {
    return false;
  }

  var check;
  var page = $(slug);
  console.log(slug);

  function check_clear() {
    clearInterval(check);
  }

  function check_trigger() {
    if (page.length === 1) {
      clearInterval(check);
      page.show();

      console.log('page exists');
    } else {
      console.error('no page');
    }
  }

  check = setInterval(check_trigger, 300);
}

$(document).ready(function() {
  initEventHandlers();
  newsEventHandlers();

  $(window).scroll(function() {
   if ($(this).scrollTop() > 100) {
       $('#scroll').fadeIn();
   } else {
       $('#scroll').fadeOut();
   }
  });

  $("#scroll").click(function() {
     $("html, body").animate({scrollTop: 0}, 1000);
  });

  $('.Carousel-item.active').slick({
    dots: true,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 2000,
 });

 $('#academymoreinfo').collapse({
  toggle: false
});

});
