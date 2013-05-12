<!--
function titleAdjust(e) {
  var texttitle = document.getElementById("post_title");
  texttitle.style.height = "1px";
  texttitle.style.height = (28 + texttitle.scrollHeight) + "px";
  e = e || window.event;
  var key = e.keyCode || e.charCode;
  return key !== 13;
}

function textAreaResize(textarea) {
  textarea.style.height = "1px";
  textarea.style.marginTop = "2px";
  textarea.style.height = (25 + textarea.scrollHeight) + "px";
  $(window).scrollTop(textarea.scrollHeight + "200")
}


    $("#post_content").cleditor({
        controls:     // controls to add to the toolbar
                              "bold italic underline strikethrough subscript superscript | font size " +
                              "style | color highlight removeformat | bullets numbering | outdent " +
                              "indent | alignleft center alignright justify | undo redo | " +
                              "rule image link unlink | cut copy paste pastetext | print source",
    })[0].focus();

    function showToolbar(){
      var toolbar = $("#toolbar");
      var editArea = $('#post_content');            
      var pos = editArea.getCaretPosition();
      var offset = editArea.offset();
      toolbar.css({
          left: offset.left + pos.left,
          top:  offset.top + pos.top,
      })
      toolbar.toggleClass("show");
    }

    $('#post_content').keyup(function(e) {
      if (e.keyCode == 16 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) {
        if ($("#toolbar").hasClass("show")) $("#toolbar").toggleClass("show");

        if (getSelected() != '') {
          showToolbar();
        }
      }
    });

    $('#post_content').dblclick(function() {
      if (getSelected() != '') {
        showToolbar();
      }
      return false;
    });

    $('#shit').click(function () {
      selection.addClass('hidden');
    })
















    window.onload = (function() {
        /*
$('div.cleditorMain > div.cleditorToolbar').hide();

        $("#post_content").click(function() {
          if ($(this).attr("id") == "shit") {
              // inside
              alert('sx');
          } else {
            if ($("#toolbar").hasClass("show")) $("#toolbar").toggleClass("show");
          }
        })*/

        /*$("#post_content").blur(function() {
            if ($("#toolbar").hasClass("show")) $("#toolbar").toggleClass("show");
        })*/
    });

    </script>
    <!--

    var div = document.getElementById("post_content");

    div.onfocus = function() {
        window.setTimeout(function() {
            var sel, range;
            if (window.getSelection && document.createRange) {
                range = document.createRange();
                range.selectNodeContents(div);
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                alert(range);
            } else if (document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(div);
                range.select();
                alert(range);
            }
        }, 1);
    };





    var editor = new wysihtml5.Editor("post_content", { // id of textarea element
      toolbar:      "toolbar", // id of toolbar element
      parserRules:  wysihtml5ParserRules // defined in parser rules set 
    });

    editor.on("focus", function() {
      $("#toolbar").toggleClass("show");
    });
    editor.on("blur", function() {
      if ($("#toolbar").hasClass("show")) $("#toolbar").toggleClass("show");
    });


$('#post_content').click(function(){
    var range = getSelected().getRangeAt(0);
    range.collapse(false);
    var dummy = document.createElement("span");
    dummy.innerHTML = "bar";
    range.insertNode(dummy);
    var rect = dummy.getBoundingClientRect();
    var x = rect.left, y = rect.top;
    // dummy.parentNode.removeChild(dummy);
    // alert(x + "/" + y);
});


$('#post_content').select(function() {
  alert('s');
  var range = getSelected().getRangeAt(0);
  range.collapse(false);
  var dummy = document.createElement("span");
  dummy.innerHTML = "bar";
  range.insertNode(dummy);
  var rect = dummy.getBoundingClientRect();
  var x = rect.left, y = rect.top;
  // dummy.parentNode.removeChild(dummy);
  // alert(x);
});

    </script>

    <!--

$('#post_content').click(function() {
  var range = window.getSelection().getRangeAt(0);
  range.collapse(false);
  var dummy = document.createElement("span");
  dummy.innerHTML = "bar";
  range.insertNode(dummy);
  var rect = dummy.getBoundingClientRect();
  var x = rect.left, y = rect.top;
  dummy.parentNode.removeChild(dummy);
  alert(x);
});




      /*var userSelection;
      if (window.getSelection) {
        userSelection = window.getSelection();
      }
      else if(document.getSelection){
        userSelection = document.getSelection();
      }
      else if (document.selection) {
        userSelection = document.selection.createRange();
      }
      $('#toolbar').html('<p>Test</p>');
    });

    function formattingToolbar() {

      
      alert(userSelection);

      if(window.getSelection){
        t = window.getSelection();
        $("<div/>").addClass("ToolBar").appendTo(container);
      }
      else if(document.getSelection){
        t = document.getSelection();
        alert('shit');
      }
      else if(document.selection){
        t = document.selection.createRange();
        alert('shit');
      }
    }
*/

  </script>




  <script>
    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
      /* iOS re-orientation fix */
      var viewportmeta = document.querySelectorAll('meta[name="viewport"]')[0];
      if (viewportmeta) {
        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
        document.body.addEventListener('gesturestart', function() {
          viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
        }, false);
      }

      /* hides Safari address bar on iPhone */
      window.addEventListener("load",function() {
        setTimeout(function() {
          window.scrollTo(0, 1);
        }, 500);
      });
    }
  </script>