/**
 * This file is contains to function how get called when the script is loaded in the client.
 * @author Andreas Kißmehl
 */
//import {build} from "./html";
/**
 * That is the first function how get called after the file is on the Client.
 */
(()=>{
	//document.cookie="test="+"123"
	build(getCookie('loopReadModesStyle'));
})();

/**
 * That function checks if a Cookie is already set with a preferred style and return that name of the style.
 * If the function fond nothing the sting 'default' is returned.
 * @returns {string} the name of the style
 */
function getCookie(cookieName) {
	console.log("test");
	let name = cookieName + "=";
	let cookieArray = decodeURIComponent(document.cookie);
	let cookieArraySplit = cookieArray.split(';');
	for (let i = 0; i < cookieArraySplit.length; i++) {
		let returnValue = cookieArraySplit[i];
		while (returnValue.charAt(0) === ' ') {
			returnValue = returnValue.substring(1);
		}
		if (returnValue.indexOf(name) === 0) {
			return returnValue.substring(name.length, returnValue.length);
		}
	}
	return "default";
}

/**
 * @todo
 * @returns {string[]}
 */
function fetchStyles() {
	return ['red', 'blue','green','yellow'];
}

/**
 *
 * @param input
 * @returns {undefined}
 */
function getSelect(input, callback, id) {
	let select = document.createElement('select');
	input.forEach((item)=>{
		let temp = document.createElement('option');
		temp.setAttribute('value', item);
		temp.innerHTML = item;
		select.append(temp);
	})
	return select;
}

/**
 *
 * @param cookie
 */
function build(cookie) {
	let styles = fetchStyles();
	let firstDiv = document.createElement('div');
	let secondDiv = document.createElement('div');
	let thirdDiv = document.createElement('div');
	firstDiv.setAttribute('id','loopReadModesBar');
	secondDiv.setAttribute('id', 'loopReadModesFont');
	thirdDiv.setAttribute('id', 'loopReadModesStyle');
	secondDiv.append(getSelect(styles, 'loopReadModesFont', 'loopReadModesFont'));
	thirdDiv.append(getSelect(styles, 'loopReadModesFont', 'loopReadModesFont'));
	firstDiv.append(secondDiv);
	firstDiv.append(thirdDiv);

	document.getElementsByTagName('header')[0].append(firstDiv);
	// hier muss jetzt das was aus fetchStyles kommt hinzugefügt werden.

}
function consoleprinterr(i) {
	console.log(i);
}
