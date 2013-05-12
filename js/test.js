// displays character counter for title
var maxLength = 75;
$('#post_title').keydown(function(e) {
  // disables ENTER key in title
  if (e.keyCode == 13)
    e.preventDefault();

  // if any CTRL, CMD, ALT, SHIFT, ENTER, ESC, TAB, ARROW KEYS don't change char counter
  if ((e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 9 || e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)) {
    // do nothing
  } else {
    var title_length = $(this).text().length,
        chars_left = (maxLength - 1) - title_length;
    // if BACKSPACE or DEL, increase char counter by 2 (we've reduced by one already on keydown)
    if (e.keyCode == 8 || e.keyCode == 46) {
      chars_left = chars_left + 2;
      if (chars_left <= maxLength && chars_left >= 0)
        changeCounterColour(chars_left);
    } else {
      // don't show counter if goes under 0
      if (chars_left <= maxLength && chars_left >= 0)
        changeCounterColour(chars_left);
    }
    if ((title_length >= maxLength) && (e.keyCode != 8) && (e.keyCode != 46) && getSelected() == '')
      e.preventDefault();
  }
});





function handlepaste (elem, e) {
    var savedcontent = elem.innerHTML;
    if (e && e.clipboardData && e.clipboardData.getData) {// Webkit - get data from clipboard, put into editdiv, cleanup, then cancel event
        if (/text\/html/.test(e.clipboardData.types)) {
            pasteHtmlAtCaret(e.clipboardData.getData('text/html'));
        }
        else if (/text\/plain/.test(e.clipboardData.types)) {
            pasteHtmlAtCaret(e.clipboardData.getData('text/plain');
        }
        else {
            // elem.innerHTML = "";
        }
        // waitforpastedata(elem, savedcontent);
        if (e.preventDefault) {
                e.stopPropagation();
                e.preventDefault();
        }
        return false;
    }
    else {// Everything else - empty editdiv and allow browser to paste content into it, then cleanup
        // elem.innerHTML = "";
        // waitforpastedata(elem, savedcontent);
        return true;
    }
}

function waitforpastsedata (elem, savedcontent) {
    if (elem.childNodes && elem.childNodes.length > 0) {
        processpaste(elem, savedcontent);
    }
    else {
        that = {
            e: elem,
            s: savedcontent
        }
        that.callself = function () {
            waitforpastedata(that.e, that.s)
        }
        setTimeout(that.callself,20);
    }
}

function processpaste (elem, savedcontent) {
    // pasteddata = elem.innerHTML;
    //^^Alternatively loop through dom (elem.childNodes or elem.getElementsByTagName) here

    // elem.innerHTML = savedcontent;

    // Do whatever with gathered data;
    // alert(pasteddata);
    // pasteHtmlAtCaret(pasteddata);
}

function pasteHtmlAtCaret(html) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
}