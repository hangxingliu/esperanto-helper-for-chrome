//@ts-check

const PREFIX = 'Esperanto Helper:';

let debugInfos = [];

let exportObject = { init, log, debugInfo, error };
module.exports = exportObject;

function log(...p) {
	//eslint-disable-next-line no-console
	console.log(PREFIX, ...p);
}

function debugInfo(...p) {
	let info = p.join(' ');
	debugInfos.push(info);
}

function error(description = '', ex = null) {
	// TODO 通知用户发生错误了, 是否需要到 Github 去反馈
	console.error(description, ex ? (ex.stack || ex) : '');
}

function init(injectScriptName = '') {
	let sep = injectScriptName.lastIndexOf('/');
	if (sep >= 0) injectScriptName = injectScriptName.slice(sep + 1);
	log(`${injectScriptName} has been injected!`);
	return exportObject;
}

