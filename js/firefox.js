// BUG: margin needs initial value to animate with CSS
$('.menu_button').hover(
  function() {
    $('body').css('margin-left', '0');
    if (windows)
      $('body').css('margin-left', '1.65em');
  },
  function() {
    setTimeout(function() {
      $('body').css('margin-left', 'auto');
    }, 500);
  }
);

// hides scrollbar unless sidebar inside admin is hovered (OSX)
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

/*** BUG OF NOT PASTING CONTENT. AT LEAST ENABLE CTRL+V ***/
// checks if CMD/CTRL is active
var ctrlDown = false;
$(document).keydown(function(e) {
  if (e.metaKey || e.ctrlKey) 
    ctrlDown = true;
}).keyup(function(e) {
  if (e.metaKey || e.ctrlKey) 
    ctrlDown = false;
});

// BUG: on(paste) get triggered too late; pastes content with CTRL+V
$("#post_content").keydown(function(e) {
  if (ctrlDown && (e.keyCode == 86)){
    $("#paste_area").css("display","block");
    selectionary = saveSelection();
    $("#paste_area").focus();
    // blur textarea, focus contenteditable, restore caret position, paste content, remove content from textarea
    setTimeout(function() {
      $("#paste_area").blur();
      $("#post_content").focus();
      restoreSelection(selectionary);
      pasteHtmlAtCaret($("#paste_area").val());
      $("#paste_area").val("");
      $("#paste_area").css("display","none");
      ctrlDown = false;
    }, 100);
  }
})

// moves toolbar buttons up a bit
$('#toolbar button').css('margin-top', '-2px');

// aligns icons of buttons better
$('.image_button').css('margin-top', '-0.2em');
$('#top_buttons .menu_button').css('margin-top', '-2.5px');
$('#top_buttons .newpost_button').css('margin-top', '-2px');
$('#editor_buttons button').css('margin-top', '-1.5px');
$('.fullscreen_button').css('line-height', '0.8em');

// smaller width and height for checkbox (isn't slider in FF)
$('.slider').css('height', 'auto').css('width', 'auto').css('top', '6px');

$('.small_post_footer').css('padding-bottom', '1.5em');