// hides scrollbar unless container is hovered
$('#sidebar, #sidebar_content ul').css('overflow-y', 'hidden');
$('#sidebar').hover(
  function() {
    $('#sidebar').css('overflow-y', 'auto');
  },
  function() {
    $('#sidebar').css('overflow-y', 'hidden');
  }
);

// hides scrollbar unless sidebar inside admin is hovered
$(' #sidebar_content ul').hover(
  function() {
    $('#sidebar_content ul').css('overflow-y', 'auto');
    $('#sidebar_content ul').css('padding-right', '2px');
  },
  function() {
    $('#sidebar_content ul').css('overflow-y', 'hidden');
    $('#sidebar_content ul').css('padding-right', '0');
  }
);

// moves toolbar buttons up a bit
$('#toolbar button').css('margin-top', '-2px');

// aligns fullscreen icon better
$('.fullscreen_button').css('line-height', '0.95em');

// moves text OFF/ON up and admin content buttons a bit with CSS
$('.slider, #sidebar_content button').addClass('windows');