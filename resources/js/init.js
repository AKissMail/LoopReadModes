/**
 * This file is contains to function how get called when the script is loaded in the client.
 * @author Andreas Kißmehl
 */
//import {build} from "./html";
/**
 * That is the first function how get called after the file is on the Client.
 */
(()=>{
	fetchStyles();
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
 * This function set up the menubar and put it in the dom.
 */
function build(input) {
	console.log(input);
	console.log('build');
	let barWrapper = document.createElement('div');
	let typoScale = getScale();
	let style = getSelect(input);
	barWrapper.setAttribute('id','loopReadModesBar');
	barWrapper.append(typoScale);
	barWrapper.append(style);
	document.getElementById('banner-logo-container').append(barWrapper);
}
/**
 * This function set up a genuin select dropdown. It takes an array of strings as an input
 * and put each element in the dropdown list.
 * @param input an array of strings
 * @returns {undefined} the dropdown as html
 */
function getSelect(input) {
	let div = document.createElement('div');
	div.setAttribute('id', 'loopReadModesStyle');
	let select = document.createElement('select');
	input.forEach((item)=>{
		let temp = document.createElement('option');
		temp.setAttribute('value', item);
		temp.innerHTML = item;
		select.append(temp);
	})
	div.append(select);
	return div;
}

/**
 * This function fetch a json file from the Server and calls build.
 * If nothing is in the JSON file or an Error happens it just calls build with ['LOOP'].
 */
function fetchStyles() {
	console.log('fetchStyles');
	fetch('../extensions/LoopReadModes/modes/modes.json')
		.then(r =>{
			r.json()
				.then(r => {
					console.log(r.StyleID);
					if(r.StyleID.length === 0){
						build(['LOOP']);
					}else {
						build(r.StyleID);
					}
				});
		}).catch(err =>{
		build(['LOOP']);
		console.log('fetch failed!: ' + err.message);
	});
}


/**
 * Diese function baut eine
 * @returns {HTMLDivElement}
 * @todo
 */
function getScale() {
	let wrapper = 	document.createElement('div');
	let smallText= 	document.createElement('div');
	let normalText= document.createElement('div');
	let largeText= 	document.createElement('div');
	wrapper.setAttribute('id', 'loopReadModesFont');

	smallText.setAttribute('id', 'smallText');

	normalText.setAttribute('id','normalText');
	largeText.setAttribute('id', 'largeText');
	wrapper.append(smallText);
	wrapper.append(normalText);
	wrapper.append(largeText);
	return wrapper;
}




