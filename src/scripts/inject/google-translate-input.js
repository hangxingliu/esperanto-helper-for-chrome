//inject-info-start
//
//	matches:
//  	- "*://translate.google.com/*"
//	run_at: "document_end"
//	all_frames: false
//
//inject-info-end

let { log } = require('./utils/logger').init(__filename);

let { $ } = require('./utils/dom');
let { UniqueCharacters } = require('./utils/esperanto');

let enable = false, lastReason = '';

let inputLanguages = $('#gt-sl-sugg').expect(1).get(0);
let inputBox = $('#source').expect(1).get(0);

updateEnableStatus();
window.addEventListener('hashchange', updateEnableStatus);
inputLanguages.addEventListener('click', updateEnableStatus);
inputBox.addEventListener('keydown', onKeydown);

/** @param {KeyboardEvent} eve */
function onKeydown(eve) {
	if (!enable) return;

	if (!eve || eve.ctrlKey || eve.altKey || eve.shiftKey) return;
	if ((eve.which || eve.keyCode) != 88) return; //'x'
	if (!eve.target) return;

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
function updateEnableStatus() {
	let hash = location.hash || '';
	let match = hash.match(/^#(\w+)/);
	if (match) return _updateEnableStatus(match[1] == 'eo', 'location.hash'); 

	let inputLanguage = $('#gt-sl').expect(1).get(0);
	if (!inputLanguage || inputLanguage.value != 'eo')
		return _updateEnableStatus(false, 'translate input language is not Esperanto');

	return _updateEnableStatus(true, 'translate input language is Esperanto');

}
function _updateEnableStatus(newEnable, reason) {
	if(enable != newEnable || reason != lastReason)
		log('input enable:', newEnable, 'because:', lastReason = reason);

	enable = newEnable;
}
