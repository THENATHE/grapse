/*
0. LOCALSTORAGE FUNCTIONS
1. ADMIN SIDEBAR INTERACTION
2. ADMIN SIDEBAR FUNCTIONS
3. NAVIGATION ARROWS
4. TEXT EDITOR BUTTONS INTERACTION
5. TEXT EDITOR BUTTONS FUNCTIONS
6. WEBSITE CONTENT INTERACTION
*/


/*** LOCALSTORAGE FUNCTIONS ***/
/******************************/
// check to see if supports LocalStorage
function supportsLocalStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

// save the state in LocalStorage
function save() {
  if (!supportsLocalStorage()) {return false;}
  localStorage['post_title'] = $('#post_title').html();
  localStorage['post_content'] = $('#post_content').html();
  localStorage['post_slug_generated'] = $('#editor_buttons input').val();
  localStorage['dark_theme'] = $('#dark_theme')[0].checked;
}

// load the text from LocalStorage
function load() {
  if (localStorage['dark_theme'] === 'true') {
    $('#dark_theme').attr({checked: 'checked'})
    // $('body').addClass('dark_theme');
    $('head').append('<link rel="stylesheet" type="text/css" title="dark_theme" href="./css/dark_theme.css">');
  } else {
    $('#dark_theme').removeAttr('checked');
    // $('body').removeClass('dark_theme');
    $('link[title=dark_theme]').prop('disabled',true);
  }
  if (localStorage['post_title']) {
    $("#post_title").html(localStorage['post_title']);
    $('#post_content').html(localStorage['post_content']);
    if (localStorage['post_slug']) {
      $('#editor_buttons input').val(localStorage['post_slug']);
    } else {
      $('#editor_buttons input').val(localStorage['post_slug_generated']);
    }
  }

  // adjusts width of sidebar_content ul to fit in window
  var window_height = $(window).height();
  if (window_height >= 600)
    $('#sidebar_content ul').css('max-height', (window_height - 485) + 'px')
}

// loads dark theme if is enabled
load();



/*** ADMIN SIDEBAR INTERACTION ***/
/*********************************/
// button for creating a new post
$('.newpost_button').click(function() {
  createNewPost();
})

// on menu button click, show admin sidebar
$('.menu_button').click(function() {
  showhideSidebar();
})

// checks if key is pressed
$('body').keydown(function(e) {
  // if ESC, and search input is hidden and text selection function doesn't exist or no text is selected, hide admin sidebar; else hides search input
  if (e.keyCode === 27) {
    // hides login window if enabled
    if ($('#login_window').hasClass('visible')) {
      $('#login_window').fadeOut().removeClass().addClass('hidden');
      return false;
    }

    if ($('#search').hasClass('hidden')) {
      if ((typeof getSelected === "undefined") || (getSelected() == '')) {
        $('body').removeClass('sidebar_expanded');
      }
    } else {
      hideSearchInput();
      e.preventDefault();
    }
  }

  // if e.metaKey + ENTER || windows ctrl + ENTER, show/hide admin sidebar
  if ((e.metaKey && e.keyCode === 13) || (e.ctrlKey && e.keyCode === 13))
    showhideSidebar();

  // if e.metaKey + ALT || windows ctrl + ALT, create a new post
  if ((e.metaKey || e.ctrlKey) && e.keyCode === 18)
    createNewPost();
})

// if the current link was clicked twice, make section fullheight or exit from fullheight
$('#admin .selected_link').dblclick(function() {
  if ($('#sidebar_content ul').hasClass('full_height')) {
    $('#statistics, .settings').slideDown();
    setTimeout(function() {
      $('#sidebar_content ul').removeClass('full_height');      
    }, 200)
  } else {
    $('#statistics, .settings').slideUp();
    setTimeout(function() {
      $('#sidebar_content ul').addClass('full_height');      
    }, 300)
  }
})

// shows container with user posts
$('.writings_link').click(function() {
  showSidebarContentContainer($('.sidebar_posts'));
  // removes selected link off other links and attaches it on this link
  $('#sidebar_content header a').each(function() {
    if ($(this).hasClass('selected_link'))
      $(this).removeClass('selected_link');
  })
  $(this).addClass('selected_link');
  return false;
})

// shows container with liked posts
$('.liked_link').click(function() {
  showSidebarContentContainer($('.sidebar_liked_posts'));
  // removes selected link off other links and attaches it on this link
  $('#sidebar_content header a').each(function() {
    if ($(this).hasClass('selected_link'))
      $(this).removeClass('selected_link');
  })
  $(this).addClass('selected_link');
  return false;
})

// shows people following user
$('.following_link').click(function() {
  showSidebarContentContainer($('.sidebar_people'));
  // removes selected link off other links and attaches it on this link
  $('#sidebar_content header a').each(function() {
    if ($(this).hasClass('selected_link'))
      $(this).removeClass('selected_link');
  })
  $(this).addClass('selected_link');
  return false;
})

// displays content container in sidebar if is hidden
function showSidebarContentContainer(container) {
  $("#sidebar_content ul").each(function() {
    // if certain container is visible but not same as one user clicked on, hide the others and display that one
    if ($(this).hasClass('visible') && ($(this).attr('class') !== container.attr('class')))
      $(this).removeClass('visible').slideUp().delay('50').queue(function(next){
        $(this).addClass('hidden');
        if (container.hasClass('hidden'))
          container.hide().removeClass('hidden').addClass('visible').slideDown();
        next();
      })
  })
}

// on search link click
$('.search_link').click(function() {
  if ($('#search').hasClass('hidden'))
    showSearchInput();
  return false;
})

// on search focus, selects all contents
$('#search input').focus(function() {
  setTimeout(function() {
    document.execCommand('selectAll',false,null);
  }, 10)
})

// on enter start search
$('#search input').keydown(function(e) {
  if (e.keyCode === 13)
    showSidebarContentContainer($('.sidebar_search_results'));
})

// on 'x' click of search hides input
$('#search button').click(function() {
  if ($('#search').hasClass('visible'))
    hideSearchInput();
})

// logout functionality
$('.logout').click(function() {
  localStorage.clear();
  alert('Logged out!');
  location.reload();
})

// on click, add/remove dark editor stylesheet
$('#dark_theme').click(function(){
  // there’s a function being executed, do not return anything
  if (timer) {
    return false;
  } else {
    if ($('#dark_theme:checked').length > 0) {
      timer = setTimeout(function() {
        $('head').append('<link rel="stylesheet" type="text/css" title="dark_theme" href="./css/dark_theme.css">');
        timer = 0;
      }, 666);
    } else {
      timer = setTimeout(function() {
        $('link[title=dark_theme]').prop('disabled',true);
        timer = 0;
      }, 666);
    }
    save();
  }
})

var popup_portfolio_position = $('.popup_portfolio').position().top,
    popup_dark_theme_position = $('.popup_dark_theme').position().top;
// on sidebar admin portfolio click shows popup help window
$('.popup_portfolio').click(function() {
  $('#admin_sidebar_popup').html('<p>Changes the layout of your posts by making its images full size. Best suitable for slideshows, and story telling. Coming soon. <a href="#" title="Learn more">Learn more.</a></p>');
  showPopup('7.5%', popup_portfolio_position - 120, 'arrow_almost_center', 'admin_sidebar');
  return false;
})

// on sidebar admin dark editor click shows popup help window
$('.popup_dark_theme').click(function() {
  $('#admin_sidebar_popup').html('<p>Changes the theme of website and sidebar to a dark palette, reducing eye strain, especially at night.</p>');
  showPopup('7.5%', popup_dark_theme_position - 100, 'arrow_left', 'admin_sidebar');
  return false;
})

// hides popup window when clicked outside the popup
$(document).mouseup(function(e) {
  var container = $("#popup");
  if (container.has(e.target).length === 0)
    hidePopup(container);
  var container = $("#admin_sidebar_popup");
  if (container.has(e.target).length === 0)
    hidePopup(container);
  var container = $("#login_window");
  if (container.has(e.target).length === 0)
    hidePopup(container);
})

// hides popup window on any link click
$('#popup, #admin_sidebar_popup').on('click', 'a', function() {
  hidePopup($(this).closest('div'));
})



/*** ADMIN SIDEBAR FUNCTIONS ***/
/*******************************/
// shows or hides the admin sidebar and hides the "older post" navigation button
function showhideSidebar() {
  if ($('body').hasClass('sidebar_expanded')) {
    $('body').toggleClass('sidebar_expanded');
    $('.older_post_arrow').toggleClass('hidden');
  } else {
    $('body').addClass('sidebar_expanded');
    $('.older_post_arrow').addClass('hidden');
  }
}

// shows search input
function showSearchInput() {
  $('#sidebar_content header').animate({left: '-500px'}, 400);
  setTimeout(function() {
    $('#search').removeClass().addClass('visible').css('width', '0');
    $('#search').animate({width: '86%', left: '500px'}, 350);
    $('#search input').focus();
  }, 30); 
}

// hides search input and displays default posts
function hideSearchInput() {
  $('#sidebar_content header').animate({left: '0'}, 400);
  setTimeout(function() {
    $('#search').animate({width: '0', left: '0'}, 300);
    setTimeout(function() {
      $('#search').removeClass().addClass('hidden');
    }, 300);
  }, 30);
  $('.writings_link').trigger('click');
}

// shows popup windows
function showPopup(x_position, y_position, arrow_class, admin) {
  if (admin === 'admin_sidebar') {
    $('#admin_sidebar_popup').css('left', x_position).css('top', y_position);
    $('#admin_sidebar_popup').hide().removeClass().addClass('visible').addClass(arrow_class).fadeIn();
  } else {
    $('#popup').css('left', x_position).css('top', y_position);
    $('#popup').hide().removeClass().addClass('visible').addClass(arrow_class).fadeIn();
  }
}

// hides popup windows
function hidePopup(popup_name) {
  if (popup_name.hasClass('visible')) {
    popup_name.fadeOut();
    setTimeout(function() {
      popup_name.removeClass().addClass('hidden');
    }, 300);
  }
}

// creates a new post
function createNewPost() {
  var page = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
  if (page != 'index.html') {
    window.location.href = 'http://sicanstudios.com/grapse';
  }

  if ($('#post_content').text().length > 0 || $('#post_title').text().length > 0) {
    if (confirm('You have already written something.\nErase everything and create a new post?')) {
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
}



/*** NAVIGATIONS ARROWS ***/
/**************************/
var timer;
// on mousemove, change top position of link button
$('#navigation_arrows a').mousemove(function(e) {
  window.clearTimeout(timer);
  var top = (e.pageY - $(document).scrollTop()) - 20;
  $(this).children("span").css('top', top + 'px');
})

// on mouseleave, move navigation links to vertical middle
$('#navigation_arrows a').mouseleave(function(e) {
  timer = setTimeout(function() {
    $('#navigation_arrows span').css('top', '45%');
  }, 900);
})

// LEFT|RIGHT arrows for next-previous post
$('body').keydown(function(e) {
  if (e.keyCode === 37 || e.keyCode === 39){
    if (($(document.activeElement).is("#post_title")) || ($(document.activeElement).is("#post_content"))) {
      // editor is focused, don't change location
      e.stopPropagation();
    } else {
      if (e.keyCode === 37) {
        if ($('.older_post_arrow').attr('href')) {
          window.location = $('.older_post_arrow').attr('href');
        }
      }
      if (e.keyCode === 39) {
        if ($('.newer_post_arrow').attr('href')) {
          window.location = $('.newer_post_arrow').attr('href');
        }
      }
    }
  }
})

$('#navigation_arrows a').mousemove(function(e) {
  window.clearTimeout(timer);
  var top = (e.pageY - $(document).scrollTop()) - 20;
  $(this).children("span").css('top', top + 'px');
})



/*** WEBSITE CONTENT INTERACTION ***/
/***********************************/

// sticky discover tabs as user scrolls down
var element = $('.stay_on_top'),
    pos = element.offset(),
    editor_height = $('#post_content').height();

// checks position of 'stay_on_top' div when typed and not refreshed in editor
$('#post_content').keyup(function() {
  pos = element.offset();
  editor_height = $('#post_content').height();
})

// on scroll calculates the position of fixed headers and stays fixed
$(document).scroll(function(){
  if (pos) {
    if ($(this).scrollTop() > pos.top && element.hasClass('stay_on_top')) {
      $(element).removeClass('stay_on_top').addClass('fixed').hide().fadeIn();
      $('#discover, .about_person').addClass('has_fixed_element');
    } else if ($(this).scrollTop() <= pos.top && element.hasClass('fixed')) {
      $(element).removeClass('fixed').addClass('stay_on_top');
      $('#discover, .about_person').removeClass('has_fixed_element');
    }
  }

  if (editor_height) {
    if ($(this).scrollTop() > editor_height + 50) {
      $('#editor_buttons, .error_message, .fullscreen_button').fadeOut('slow');
      $('.has_editor_buttons').addClass('close');
    } else {
      // if is fullscreen, don't show elements
      if (document.fullscreenElement) {
        enterFullscreen();
      } else if (document.mozFullScreen) {
        enterFullscreen();
      } else if (document.webkitIsFullScreen) {
        enterFullscreen();
      } else {
        $('#editor_buttons, .error_message, .fullscreen_button').fadeIn('slow');
        $('.has_editor_buttons').removeClass('close');
      }
    }
  }
})

// on name click in profile page, scroll to top
$('.about_person span a').click(function() {
  $('body,html').animate({scrollTop: 0}, 300);
  return false;
})

// 'follow' and 'like' buttons
$('.like_button, .follow_button').click(function(){
  // if has class 'added' means is enabled; remove states and shows default state
  if ($(this).hasClass('added')) {
    $(this).removeClass('remove_state_enabled added white').addClass('add');
    // adds specific colour according to type of button
    if ($(this).hasClass('like_button')) {
      $(this).addClass('brown');
    } else {
      $(this).addClass('green');
    }
  } else {
    // else means is not enabled; shows enabled state and on mouseleave allows user to remove state
    $(this).removeClass('add brown').addClass('added white');
    $('.like_button.added.white, .follow_button.added.white').mouseleave(function() {
      if ($(this).hasClass('add')) {
        // do not add remove state on default state
      } else {
        $(this).addClass('remove_state_enabled');
      }
    })
  }
})



/*** WEBSITE CONTENT FUNCTIONS ***/
/*********************************/




/*** LOGIN WINDOW INTERACTION ***/
/********************************/
$('h2').click(function() {
  showLoginWindow();
})

// SHIFT click, changes wording and button to 'login'
var showed_login = false;
$('body').keydown(function(e) {
  if ($('#login_window').hasClass('visible'))
    if ((e.shiftKey)) {
      // changes 'invite' to 'login'
      $('#login_window').html('<div><h2>Already have an account? Awesome!</h2><button class="twitter light_blue login">Login with Twitter</button><br/><span>Login with Facebook coming soon. We will never post on your behalf. Your Grapse profile will be created from your username. <a href="#">Read our Privacy</a>.</span></div>');
      showed_login = true;
    }
})

// on CMD or CTRL out changes wording and button back to 'invite'
$('body').keyup(function() {
  if ($('#login_window').hasClass('visible'))
    if (showed_login)
      inviteWindow();
})

// if 'invite' or 'login' buttons clicked
$('body').on('click', '#login_window button', function() {
  if ($(this).hasClass('invite')) {
    alert('Your request has been received. Thanks!');
  } else if ($(this).hasClass('login')) {
    alert('You have already requested an invite. Patience is a virtue.');
  }
})



/*** LOGIN WINDOW FUNCTIONS ***/
/******************************/
// shows invite/login window
var window_not_created = true;
function showLoginWindow() {
  inviteWindow();
  $('#login_window').hide().removeClass().addClass('visible').fadeIn();
};

// creates invite window
function inviteWindow() {
  // <!-- http://branch.com/users/auth/twitter?waitlist=true | 13:11:41 Jan 26, 2013 -->
  // <!-- https://api.twitter.com/oauth/authenticate?oauth_token=yYn5WBipxB5FVsP9k9k28eQeIINJ7q0oe81Uw0zvgKs -->

  if (window_not_created) {
    $(document.createElement('div')).attr('id', 'login_window').hide().appendTo('body');
    window_not_created = false;
  }
  $('#login_window').html('<div><h2>You need an account for that.</h2><button class="twitter light_blue invite">Request an invite</button><br/><span>Login with Facebook coming soon. We will never post on your behalf. Your Grapse profile will be created from your username. <a href="#">Read our Privacy</a>.</span></div>');
}