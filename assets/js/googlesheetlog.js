function resetForm(name) {
  $(document.forms[name]).find('input[type=text], input[type=tel], input[type=email], textarea, select').val('');
  $(document.forms[name]).find('input[type=submit]').prop('disabled', false);
}

function disableSubmitButton(name) {
  $(document.forms[name]).find('input[type=submit]').prop('disabled', true);
}

function alert(name) {
  switch(name) {
    case 'messageEmbassy':
      return `
        <div id="connectWithAdvisor--alert-success" class="alert alert-success" role="alert">
          <strong>Your message is received</strong> and embassy staff will respond to your message appropriately. There is no need to send another message. Thank you.
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `;
      break;
    default:
      break;
  }
}

function successAlert(name) {
  $('.alert').remove();
  $('body').prepend(alert(name));
}

function urlByFormName(name) {
  switch(name) {
    case 'messageEmbassy':
      return 'https://script.google.com/macros/s/AKfycbxohNbRJtHmAkGIVsUtmCmzwV6c-bUpoCdWlnZ_zWF5WbfxPxId/exec'; // josh@
      break;
    // case 'requestPortalAccess':
    //   return ''; // josh@
    //   break;
    default:
      return null;
  }
}

function formSubmit(name) {
  disableSubmitButton(name);

  var serializedData = $(document.forms[name]).serializeObject();
  var url = urlByFormName(name);

  var jqxhr = $.ajax({
    url,
    method: "GET",
    dataType: "json",
    data: serializedData,
    success: function(data){
      resetForm(name);
      successAlert(name);
    }
  });
}

function initEventHandlers() {
  $('.google-form').on('submit', function(e) {
    e.preventDefault();

    const name = e.currentTarget.name;

    formSubmit(name);
  });
}
