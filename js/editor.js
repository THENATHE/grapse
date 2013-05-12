/*
1. FUNCTIONS TO RUN AT LOADING
2. LOCALSTORAGE FUNCTIONS
3. KEYBOARD SHORTCTUS
4. TEXT EDITOR INTERACTION
5. TEXT EDITOR TOOLBAR INTERACTION
6. TEXT EDITOR TOOLBAR FUNCTIONS
7. TEXT SELECTION FUNCTIONS
8. DISCOVER CONTENT INTERACTION
9. DISCOVER CONTENT FUNCTIONS
*/



/*** FUNCTIONS TO RUN AT LOADING ***/
/***********************************/
// loads items from localStorage if exists // makes height of content editor same as window // checks how many words/chars // changes default title with document title
// load();
adjustContentHeight();
wordCount();
changeTitle();

// focuses on post content
$('#post_content').focus();


// /*** LOCALSTORAGE FUNCTIONS ***/
// /******************************/
// // check to see if supports LocalStorage
// function supportsLocalStorage() {
//   try {
//     return 'localStorage' in window && window['localStorage'] !== null;
//   } catch (e) {
//     return false;
//   }
// }

// // save the state in LocalStorage
// function save() {
//   if (!supportsLocalStorage()) {return false;}
//   localStorage['post_title'] = $('#post_title').html();
//   localStorage['post_content'] = $('#post_content').html();
//   localStorage['post_slug_generated'] = $('#editor_buttons input').val();
//   localStorage['dark_editor'] = $('#dark_editor')[0].checked;
// }

// // load the text from LocalStorage
// function load() {
//   if (localStorage['dark_editor'] == 'true') {
//     $('#dark_editor').attr({checked: 'checked'})
//     // $('body').addClass('dark_editor');
//     $('head').append('<link rel="stylesheet" type="text/css" title="dark_editor" href="./css/dark_editor.css">');
//   } else {
//     $('#dark_editor').removeAttr('checked');
//     // $('body').removeClass('dark_editor');
//     $('link[title=dark_editor]').prop('disabled',true);
//   }
//   if (localStorage['post_title']) {
//     $("#post_title").html(localStorage['post_title']);
//     $('#post_content').html(localStorage['post_content']);
//     if (localStorage['post_slug']) {
//       $('#editor_buttons input').val(localStorage['post_slug']);
//     } else {
//       $('#editor_buttons input').val(localStorage['post_slug_generated']);
//     }
//   }
// }



/*** KEYBOARD SHORTCUTS ***/
/**************************/
// body keyboard shortcuts
$('body').keydown(function(e) {
  // CMD || CTRL && SHIFT + F enter fullscreen mode
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.keyCode == 70) {
    if (document.fullscreenElement) {
      exitFullscreen();
    } else if (document.mozFullScreen) {
      exitFullscreen();
    } else if (document.webkitIsFullScreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }

  // CMD || CTRL + S saves post 
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 83) {
    savePost();
    e.preventDefault();
  }

  // CMD || CTRL + U shows url input slug 
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 85) {
    showSlugInput();
    e.preventDefault();
  }

  // CMD || CTRL + G publishes post 
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 71) {
    publishPost();
    e.preventDefault();
  }

  // CMD || CTRL + BACKSPACE deletes post 
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.keyCode == 8)
    deletePost();

  // on reload (CMD + R) cleans HTML code
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 82)
    cleanHTML();
})

// text editor keyboard shortcuts
$('#post_content').keydown(function(e) {
  // if BACKSPACE | DEL and no text, dont't remove last <p> node
  if (e.keyCode == 8 || e.keyCode == 46) {
    if (($('#post_content').text() == '') && (!$("#post_content").find('img').length > 0)) {
      return false;
    }
  }

  // BUG: when removing <img> tag, it changes formatting to <font>
  $('font').replaceWith('');

  // if ENTER fix bugs
  if (e.keyCode == 13) {
    var nodeNames = findNodes(getSelected().focusNode);
    // BUG: when new line after <blockquote>, it keeps creating <blockquote>s; create <p> instead
    if (selectNode(nodeNames, 'BLOCKQUOTE')) {
      setTimeout(function() {
        document.execCommand('formatBlock', false, 'p');
      }, 100);
    }

    if (selectNode(nodeNames, 'H2')) {
      setTimeout(function() {
        document.execCommand('formatBlock', false, 'p');
      }, 100);
    }
  }
  
  // if e.metaKey + 1 || windows ctrl + 1, make italic
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 49) {
    makeItalic();
    e.preventDefault();
  }

  // if e.metaKey + 2 || windows ctrl + 2 , make heading
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 50) {
    makeHeading();
    e.preventDefault();
  }

  // if e.metaKey + 3 || windows ctrl + 3, add link
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 51) {
    showUrlInput();
    e.preventDefault();
  }

  // if e.metaKey + 4 || windows ctrl + 4, add image
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 52) {
    showImageInput();
    e.preventDefault();
  }

  // if e.metaKey + 5 || windows ctrl + 5, add list
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 53) {
    createList();
    e.preventDefault();
  }

  // if e.metaKey + 6 || windows ctrl + 6, add quote
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 54) {
    createQuote();
    e.preventDefault();
  }

  // if e.metaKey || windows ctrl + SHIFT + C, show export HTML window
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.keyCode == 67) {
    if (windows) {
      $('.window').addClass('windows text');
    } else {
      $('.window').addClass('mac text');
    }
    select = clean($('#post_content').html());
    showUrlInput();
    $('input[type=url]').val(select).select();
    e.preventDefault();
  }
})

// modal window keyboard shortcuts
$('.window input').keydown(function(e){
  // if ESC, bring back old selection and after hide toolbar
  if (e.keyCode == 27) {
    restoreSelection(selections);
    hideToolbar();
    $('.window').removeClass('text').removeClass('windows').removeClass('mac');
  }

  // on ENTER check if link or image
  if (e.keyCode == 13) {
    if ($(this).parent('div').hasClass('link')) {
      addLink();
    } else {
      addImage();
    }
  }

  // if e.metaKey + BACKSPACE || DEL || windows ctrl, remove link
  if ((e.metaKey || e.ctrlKey) && (e.keyCode == 8 || e.keyCode == 46)) {
    removeStyling();
    restoreSelection(selections);
    e.preventDefault();
  }

  // if SPACEBAR, encodes space to "%20"
  if (e.keyCode == 32) {
    $('.window input').val($(this).val() + '%20');
    e.preventDefault();
  }

  // if text was copied, hide the window
  if ((e.metaKey || e.ctrlKey) && e.keyCode == 67) {
    if ($('.window').hasClass('text')) {
      setTimeout(function() {
        restoreSelection(selections);
        hideToolbar();
        $('.window').removeClass('text').removeClass('windows').removeClass('mac');
      }, 100);
    }
  }
})



/*** TEXT EDITOR INTERACTION ***/
/********************************/
// changes title on keyup (not keydown), counts characters left and saves 
$('#post_title').on("keyup paste", function(e) {
  changeTitle();
  charCount();
  changeSlug();
  save();
})

// on focus, counts characters and displays counter
$('#post_title').focus(function() {
  charCount();
  $('#chars_counter').hide().fadeIn();
})

// on blur, hides the counter and trims HTML content
$('#post_title').blur(function() {
  $('#chars_counter').fadeOut();
  cleanHTML();
})

// if no text is selected, populate with empty <p>
$('#post_content').keyup(function(e) {
  // checks if content is completely empty and populates with <p> node
  if ($('#post_content').text() == '') {
    if (($('#post_content').html() == '') || ($('#post_content').html() == '<br>') || ($('#post_content').html() == '<blockquote><br></blockquote>')) {
      $('#post_content').html('<p><br></p>');
      // BUG: in Firefox it selects the HTML elements as well
      if (!(firefox))
        document.execCommand('selectAll',false,null);
      hideToolbar();
    }
  }
  // if ESC, hide toolbar
  if (e.keyCode == 27) {
    hideToolbar();
    e.preventDefault();
    e.stopPropagation();
  } else {
    checkTextSelected();
  }
})

// on keyup and focus counts words and characters
$('#post_content').on("focus keyup", function() {
  wordCount();
})

// only on #post_content show toolbar; stop propagation going further down DOM
$('#post_content, #toolbar').mouseup(function(e){
  setTimeout(function() {
    checkTextSelected();
  }, 10);
  e.stopPropagation();
})

// on mouseup hides the toolbar if active
$(window).mouseup(function() {
  if ($('#toolbar').hasClass('hidden')) {
    // do nothing, toolbar is hidden
  } else {
    hideToolbar();
  }
})

// on paste, strip clipboard from HTML tags if any
$('#post_title, #post_content').on("paste", function() {
  $("#paste_area").css("display","block");
  selection = saveSelection();
  $("#paste_area").focus();
  // blur textarea, focus contenteditable, restore caret position, paste content, remove content from textarea
  setTimeout(function() {
    $("#paste_area").blur();
    $("#post_content").focus();
    restoreSelection(selection);
    var text = $('<div>').html($("#paste_area").val()).text();
    pasteHtmlAtCaret(text);
    $("#paste_area").val("");
    $("#paste_area").css("display","none");
    // ctrlDown = false;
  }, 20);
})

// on save button click calls savePost() function
$('.save_button').click(function() {
  savePost();
})

// on slug button click expands width and shows input
$('.slug_button').click(function() {
  showSlugInput();
})

// on publish button click calls publishPost() function
$('.publish_button').click(function() {
  publishPost();
})

// on delete button click calls deletePost() function
$('.deletes_button').click(function() {
  deletePost();
})

// on input blur it hides the input
$('#editor_buttons input').blur(function() {
  hideSlugInput();
})

// editor url slug input on keypress adds post_slug user submitted value
$('#editor_buttons input').keydown(function(e) {
  // hides the input on ESC or ENTER
  if ((e.keyCode == 27) || e.keyCode == 13) {
    hideSlugInput();
  }

  // if SPACEBAR, encodes space to "%20"
  if (e.keyCode == 32) {
    $('#editor_buttons input').val($(this).val() + '%20');
    e.preventDefault();
  }
})

// on keyup save input post url to localstorage
$('#editor_buttons input').keyup(function() {
  localStorage['post_slug'] = $('#editor_buttons input').val();
})

// on click enters/exits Fullscreen
$('.fullscreen_button').click(function() {
  if (document.fullscreenElement) {
    exitFullscreen();
  } else if (document.mozFullScreen) {
    exitFullscreen();
  } else if (document.webkitIsFullScreen) {
    exitFullscreen();
  } else {
    enterFullscreen();
  }
})

// triggered both when fullscreen (or not)
$(window).bind('fullscreenchange mozfullscreenchange webkitfullscreenchange', function(e) {
  if (document.fullscreenElement) {
    enterFullscreen();
  } else if (document.mozFullScreen) {
    enterFullscreen();
  } else if (document.webkitIsFullScreen) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
})



/*** TEXT EDITOR FUNCTIONS ***/
/*****************************/
// changes title according to title input element
var pageTitle = $(document).attr('title');
function changeTitle() {
  var title = $('#post_title').text();
  if (title) {
    $('title').text(title);
  } else {
    $('title').text(pageTitle);
  }
}

// generates slug from title if user has not inputed a slug
function changeSlug() {
  // if user typed slug doesn't exist or is empty generates it and removes the empty user slug
  if ((typeof localStorage['post_slug'] === undefined) || (localStorage['post_slug_generated'] == '')) {
    text = $('#post_title').text().replace(/ /g, '-').toLowerCase();
    $('#editor_buttons input').val(text);
    localStorage.removeItem('post_slug');
  }

  // if user typed slug exists, does nothing, else generates it 
  if (localStorage['post_slug']) {
    // do nothing
  } else {
    text = $('#post_title').text().replace(/ /g, '-').toLowerCase();
    $('#editor_buttons input').val(text);
  }
}

// shows slug input
function showSlugInput() {
  $('#editor_buttons').toggleClass('expanded');
  $('#editor_buttons input').toggleClass('hidden').focus().select();
  if (slug_already_exists)
    $('.error_message').fadeIn();
}

// hides the slug
function hideSlugInput() {
  $('#editor_buttons').removeClass('expanded');
  $('#editor_buttons input').addClass('hidden');
  $('.error_message').fadeOut();
}

// saves a post (private)
var slug_already_exists = true,
    error_message_visible = false;
function savePost() {
  if (slug_already_exists) {
    if (error_message_visible) {
      $('.error_message').fadeIn();
    } else {
      $('<div>').addClass('error_message').html('A post with the same URL already exists. Please change it and try saving again.').insertAfter('#editor_buttons');
      error_message_visible = true;
    }
    showSlugInput();
    $('#editor_buttons input').addClass('error');
  } else {
    alert('saved');
    $('.error_message').fadeOut();
    $('#editor_buttons input').removeClass('error');
  }
  save();
}

// publishes a post (public)
function publishPost() {
  alert('Your post “' + $('#post_title').text() + '” has been published!');
}

function deletePost() {
  if (confirm('Are you sure you want to delete your post “' + $('#post_title').text() + '” and its content? This action cannot be undone!')) {
    localStorage.removeItem('post_title');
    localStorage.removeItem('post_content');
    localStorage.removeItem('post_slug');
    localStorage.removeItem('post_slug_generated');
    $('#post_title').html('New post').focus();
    document.execCommand('selectAll',false,null);
    $('#post_content').html('<p><br/></p>');
    // BUG: firefox adds content outside <p></p>
    if (firefox)
      $('#post_content').html('<p>Insert your text here&#8230;</p>');
    save();
  } else {
    $('#post_content').focus();
  }
}

// enters Fullscreen
function enterFullscreen() {
  var elem = document.documentElement,
      fullscreen_supported = true;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else {
    fullscreen_supported = false;
    alert ("Your browser doesn't support Fullscreen mode. Please upgrade your browser.");
  }
  if (fullscreen_supported) {
    $('.fullscreen_button').attr({title: 'Exit Fullscreen mode (Esc)'}).addClass('active');
    $('#admin, #editor_buttons, .error_message, .word_count, #discover, #footer').hide();
    $('.discover_alert').fadeOut();
  }
}

// exits Fullscreen
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }
  $('.fullscreen_button').attr({title: 'Enter Fullscreen mode (Cmd+Shift+F)'}).removeClass('active');
  $('#admin, #editor_buttons, .word_count, #discover, #footer').show();
  adjustContentHeight();
}

// makes height of content same as height of window
function adjustContentHeight() {
  var title_height = $('#post_title').height(),
      content_height = height - title_height - 173;
  $('#post_content').css('min-height', content_height + 'px');
  pos = element.offset(); // for fixed header
}

// calculates characters left
function charCount() {
  var title_length = $('#post_title').text().length,
      chars_left = 75 - title_length;
  changeCounterColour(chars_left);
}

// changes colour of counter number
function changeCounterColour(chars_left) {
  if (chars_left < 0) {
    $('#chars_counter').removeClass().addClass('red_bright_colour');
  } else if (chars_left < 10) {
    $('#chars_counter').removeClass().addClass('red_colour');
  } else if (chars_left >= 10 && chars_left <= 25) {
    $('#chars_counter').removeClass().addClass('yellow_colour');
  } else {
    $('#chars_counter').removeClass();
  }
  $('#chars_counter').html(chars_left);
}

// counts words and characters of post content
function wordCount() {
  var content_div = $('#post_content'),
      content_text,
      char_count = content_div.text().length,
      word_count = 0,
      word = "words",
      character = "characters";
  // if there are characters, change word count from 0
  if (char_count > 0) 
    content_div.children().each(function(index, el) {
      content_text += $(el).text()+"\n";
    })
  // if there is content split the text at spaces (else displays 0 words)
  if (typeof content_text !== "undefined")
    word_count = content_text.split(/\s+/).length - 1;
  // singular text when only one
  if (word_count == 1)
    word = "word";
  if (char_count == 1)
    character = "character";
  $('.word_count').html(word_count + " " + word + " &nbsp;&bull;&nbsp; " + char_count + " " + character);
}

// replaces user HTML input from empty <p>, <style>, or <font>
function cleanHTML() {
  $('#post_content *').removeAttr('style').removeAttr('font');
  $('#post_content p').each(function() {
    var $this = $(this);
    if ($this.html().replace(/\s|&nbsp;/g, '').length == 0)
      $this.remove();
  })
  title = clean($('#post_title').html());
  $('#post_title').html(title.substring(0,75));
  changeTitle();
  content = $('#post_content').html();
  var chunks = content.match(/(<.+?>|[^<]+)/g);
  cleaned = chunks.map(function(chunk){
    return /</.test(chunk) ? chunk : clean(chunk)
  }).join('');
  $('#post_content').html(cleaned);
  save();
};

// replaces ", ', --, <div> with <p>
function clean(html) {
  html = html.replace(/'\b/g, "&lsquo;")  // \u2018 opening singles
         .replace(/\b'/g, "&rsquo;")  // \u2019 closing singles
         .replace(/"\b/g, "&ldquo;")  // \u201c opening doubles
         .replace(/\b"/g, "&rdquo;")  // \u201d closing doubles
         .replace(/--/g,  "&mdash;") // \u2014 em-dashes
         .replace(/<div>/g, "<p>")  // replaces <div> with <p>
         .replace(/<\/div>/g, "</p>"); // replaces </div> with </p>
  return html;
};



/*** TEXT EDITOR TOOLBAR INTERACTION ***/
/***************************************/
// toolbar buttons
$('.italic_button').click(function() {
  makeItalic();
})
$('.heading_button').click(function() {
  makeHeading();
})
$('.link_button').click(function() {
  showUrlInput();
})
$('.insert_button').click(function() {
  if ($(this).parent('div').hasClass('link')) {
    addLink();
  } else {
    addImage();
  }
})
$('.remove_button').click(function() {
  removeStyling();
})
$('.image_button').click(function() {
  showImageInput();
})
$('.list_button').click(function() {
  createList();
})
$('.quote_button').click(function() {
  createQuote();
})



/*** TEXT EDITOR TOOLBAR FUNCTIONS ***/
/*************************************/
function makeItalic() {
  document.execCommand('italic', false);
}

function makeHeading() {
  var nodeNames = findNodes(getSelected().focusNode);
  if (selectNode(nodeNames, 'H2')) {
    document.execCommand('formatBlock', false, '<P>');
  } else if (selectNode(nodeNames, 'UL')) {
    // do not change formatting to H2 inside UL
  } else {
    document.execCommand('formatBlock', false, '<H2>');
  }
}

// stores user selected text for later use and the parentNode
var selections, href;
function showUrlInput() {
  if ($('.window').hasClass('image'))
    $('.window').removeClass('image').addClass('link');
  selections = saveSelection();
  getHTMLOfSelection();
  link = $(href).attr('href');
  // changes the input text if selected node is a link
  if (link) {
    $('.link input').val(link);
  } else {
    $('.link input').val('http://');
  }
  $('.link').toggleClass('hidden');
  $('.link input').focus().select();
}

function removeStyling() {
  restoreSelection(selections);
  document.execCommand('unlink', false);
  hideToolbar();
  document.getSelection().removeAllRanges();
}

// adds link to restored selection if link input is valid
function addLink() {
  var inputVal = $(".link input").attr('value');
  if (inputVal !== 'http://' && inputVal !== '') {
    restoreSelection(selections);
    var nodeNames = findNodes(getSelected().focusNode);
    // BUG: when <i> is selected and then <a href>, <i> is removed
    if (selectNode(nodeNames, 'I')) {
      document.execCommand('insertHTML', false, "<a href='" + inputVal + "' target='_blank' title='" + selections + "'><i>" + selections + "</i></a>");
    } else {
      // $('img').closest('a').addClass('img');
      // if selection is empty, means it's an image (since we reached this far in the loop); add <p>
      if (getSelected() == '') {
        document.execCommand('insertHTML', false, "<a href='" + inputVal + "' class='img' target='_blank' title='" + selections + "'>" + getHTMLOfSelection() + "</a><p><br></p>");
      } else {
        document.execCommand('insertHTML', false, "<a href='" + inputVal + "' target='_blank' title='" + selections + "'>" + getHTMLOfSelection() + "</a>");
      }
    }
    // BUG: Firefox keeps the <a> tag open; adds space to close
    if (firefox)
      document.execCommand('insertHTML', false, "&nbsp;");
    hideToolbar();
  }
}

function showImageInput(){
  if ($('.window').hasClass('link'))
    $('.window').removeClass('link').addClass('image');
  selections = saveSelection();
  $('.image input').val('http://');
  $('.image').toggleClass('hidden');
  $('.image input').focus().select();
}

// adds image to restored selection if link input is valid
function addImage() {
  var inputVal = $(".image input").attr('value');
  if (inputVal !== 'http://' && inputVal !== '') {
    restoreSelection(selections);
    if (selections) {
      document.execCommand('removeFormat', false);
      document.execCommand('insertHTML', false, "<p><img src='" + inputVal + "' alt='" + selections + "'/></p><p><br></p>");
    } else {
      document.execCommand('removeFormat', false);
      document.execCommand('insertHTML', false, "<p><img src='" + inputVal + "' alt='image' /></p><p><br></p>");
    }
  }
}

function createList() {
  document.execCommand('insertunorderedlist', false, null);
  return false;
}

function createQuote() {
  var nodeNames = findNodes(getSelected().focusNode);
  if (selectNode(nodeNames, 'BLOCKQUOTE')) {
    document.execCommand('formatBlock', false, '<P>');
  } else {
    document.execCommand('formatBlock', false, '<BLOCKQUOTE>');
  }
}

function showToolbar(rectangle, nodeNames) {
  if ($('#toolbar').hasClass('hidden'))
    $('#toolbar').toggleClass('hidden').hide().fadeIn('fast');

  // show active formatting
  if (selectNode(nodeNames, 'I')) {
    $('.italic_button').addClass('active');
  } else {
    $('.italic_button').removeClass('active');
  }
  if (selectNode(nodeNames, 'H2')) {
    $('.heading_button').addClass('active');
  } else {
    $('.heading_button').removeClass('active');
  }
  if (selectNode(nodeNames, 'A')) {
    $('.link_button').addClass('active');
  } else {
    $('.link_button').removeClass('active');
  }
  if (selectNode(nodeNames, 'UL')) {
    $('.list_button').addClass('active');
  } else {
    $('.list_button').removeClass('active');
  }
  if (selectNode(nodeNames, 'BLOCKQUOTE')) {
    $('.quote_button').addClass('active');
  } else {
    $('.quote_button').removeClass('active');
  }

  // positions the toolbar above the selected text if not on mobile
  if (!(smallScreen))
    $('#toolbar').css('top', rectangle.top - 50 + document.body.scrollTop + "px").css('left', (rectangle.left + rectangle.right)/2 - 120 + "px");
}

// hides toolbar
function hideToolbar() {
  $('#toolbar').fadeOut('fast');
  $('.window').addClass('hidden');
  setTimeout(function() {
    $('#toolbar').addClass('hidden');
  }, 100);
}



/*** TEXT SELECTION FUNCTIONS ***/
/********************************/
// checks if text is selected and appends toolbar
function checkTextSelected() {
  // if title, don't show toolbar or hide if enabled
  if ($(document.activeElement).is("#post_title")) {
    // hideToolbar();
  } else {
    var selection = getSelected();

    // text is not selected/deselected; hide toolbar
    if (selection.isCollapsed == true && document.activeElement.nodeName != 'INPUT') {
      hideToolbar();
    }

    // text is selected
    var nodeNames = findNodes(selection.focusNode);
    if (selection.isCollapsed == false && selectNode(nodeNames, 'DIV') && selection !== '\n') {
      // finds selection and bounding rectangle
      var range = selection.getRangeAt(0);
      var rectangle = range.getBoundingClientRect();
      showToolbar(rectangle, nodeNames);
    }
  }

  save();
}

// gets user selected text
function getSelected(){
  if (window.getSelection){
    selection = window.getSelection();
  } else if (document.getSelection){
    selection = document.getSelection();
  } else if (document.selection){
    selection = document.selection.createRange();
  }
  return selection;
}

// gets the HTML of the text selection (useful for images)
function getHTMLOfSelection() {
  var range, node;
  if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    // gets link of href for IE
    node = range.commonAncestorContainer ? range.commonAncestorContainer :
               range.parentElement ? range.parentElement() : range.item(0);
    href = node.parentNode;
    return range.htmlText;
  }
  else if (window.getSelection) {
    var selection = window.getSelection();
    // gets link of href
    node = selection.anchorNode;
    href = node.parentNode;

    if (selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      var cloneSelection = range.cloneContents();
      var div = document.createElement('div');
      div.appendChild(cloneSelection);
      return div.innerHTML;
    }
    else {
      return '';
    }
  }
  else {
    return '';
  }
}

// pastes CTRL+V content at caret position
function pasteHtmlAtCaret(html) {
  var sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      var el = document.createElement("div");
      el.innerHTML = html;
      var frag = document.createDocumentFragment(), node, lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type != "Control") {
    document.selection.createRange().pasteHTML(html);
  }
}

// saves user text selection for later use
function saveSelection() {
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    }
  } else if (document.selection && document.selection.createRange) {
    return document.selection.createRange();
  }
  return null;
}

// restores user text selection
function restoreSelection(range) {
  if (range) {
    if (window.getSelection) {
      sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (document.selection && range.select) {
      range.select();
    }
  }
}

// finds nodes of selection
function findNodes(element) {
  if (element) {
    var nodeNames = [];
    while (element.parentNode) {
      nodeNames.push(element.nodeName);
      element = element.parentNode;
    }
    return nodeNames;
  } else {
    return null;
  }
}

// checks to see if a node with that name exists in that selection
function selectNode(nodes, name) {
  if (nodes) {
    for(var i = nodes.length; --i > 0;) {
      if (nodes[i] == name){
        return true
      }
    }
    return false;
  }
}



/*** DISCOVER CONTENT INTERACTION ***/
/*************************************/
var alertTimer, 
    currently_visible = false,
    clicked_on_alert = false;
// on focus or keypress start timer and on keypress, reset timer
$('#post_title, #post_content').on('focus keypress', function() {
  showAlert();
})

// on focus start timer and on keypress, reset timer
$('button').click(function() {
  currently_visible = false;
  $('.discover_alert').fadeOut();
})

// resets timer on mousemove and blur
$(window).on('mousemove blur', function() {
    clearTimeout(alertTimer);
    alertTimer = null;
  // }
})

// on scroll hides the alert popup
$(window).on('scroll', function() {
  currently_visible = false;
  $('.discover_alert').fadeOut();
})



/*** DISCOVER CONTENT FUNCTIONS ***/
/**********************************/
// timer for showing the discover alert
function showAlert() {
  if (alertTimer) {
    clearTimeout(alertTimer);
    alertTimer = null;
  }

  // shows alert if not visible
  if (currently_visible == false && clicked_on_alert == false)
    alertTimer = setTimeout(createDiscoverAlert, 20000);
}

// creates and shows the discover alert
function createDiscoverAlert() {
  // if fullscreen requested, don't create an alert
  if (document.fullscreenElement) {
  } else if (document.mozFullScreen) {
  } else if (document.webkitIsFullScreen) {
  } else {
    $(document.createElement('div')).addClass('discover_alert').hide().appendTo('body');
    $('.discover_alert').html('<p>Experiencing writer&rsquo;s block? Get inspired by <a href="#discover" class="discover_link">your friends&rsquo; writings &rarr;</a><a href="#" title="Hide this message">&times;</a></p>').fadeIn();
    currently_visible = true;

    $('.discover_link').click(function() {
      $('html, body').animate({
        scrollTop: $("#discover").offset().top - 30
      }, 400);
      clicked_on_alert = true;
      return false;
    })

    // on any link click, remove the alert
    $('.discover_alert a').click(function() {
      $('.discover_alert').remove();
      clicked_on_alert = true;
      return false;
    })
  }
}