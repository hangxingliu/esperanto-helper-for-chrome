//inject-info-start
//
//	matches:
//  	- "*://*.duolingo.cn/*"
//  	- "*://*.duolingo.com/*"
//	run_at: "document_end"
//	all_frames: false
//
//inject-info-end

require('./utils/logger').init('duolingo-input.js');

let { UniqueCharacters } = require('./utils/esperanto');

document.addEventListener('keydown', onKeydown);

/** @param {KeyboardEvent} eve */
function onKeydown(eve) {
	if (!eve || eve.ctrlKey || eve.altKey || eve.shiftKey) return;
	if ((eve.which || eve.keyCode) != 88) return; //'x'
	if (!eve.target) return;

	let { tagName, placeholder } = eve.target;
	if (tagName != 'INPUT' && tagName != 'TEXTAREA') return;
	if (String(placeholder).toLowerCase().indexOf('esperanto') < 0) return;

	let { selectionStart, selectionEnd, value } = eve.target;
	if (typeof selectionStart != 'number' || typeof selectionEnd != 'number') return;
	if (selectionEnd != selectionStart) return;

	let oldChar = value.slice(selectionStart - 1, selectionStart);
	if (!(oldChar in UniqueCharacters)) return;
	
	let newChar = UniqueCharacters[oldChar];
	console.log(oldChar, newChar);

	eve.preventDefault();
	document.execCommand('delete', false);
	document.execCommand('insertText', false, newChar);
}
