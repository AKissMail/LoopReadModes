/**
 * @author Andreas Kißmehl
 */
let config; 	// Global variable for the Config object after it is fetched from the Server.
let styleURL;	// The URI of the current Stylesheet
let currentStyle = getCookie("style");
let textSize = getCookie("textSize");
let search = false;
const configURL= "../extensions/LoopReadModes/modes/modes.json"; // URI of the Configfile.
const altConfigURL = "./extensions/LoopReadModes/modes/modes.json";

/**
 * That function checks if a Cookie is already set with a preferred style and return that name of the style.
 * If the function fond nothing the sting '' is returned.
 * @returns {string} the name of the style
 */
function getCookie(cookieName) {
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
	return "";
}

/**
 * This function set up the menubar and put it in the dom.
 */
function build(input) {
	let barWrapper = elementWithOneAttributes('div', 'id','loopReadModesBar');
	let typoScale = getScale();
	let style = getSelect(input.StyleID);
	barWrapper.append(typoScale);
	barWrapper.append(style);
	document.getElementById('banner-logo-container').append(barWrapper);

	addListener();
	if(currentStyle){
		updateStyle(currentStyle);
	}
	if(textSize){
		changeP(textSize);
	}else{
		textSize = 16;
	}
}

/**
 * This function set up a genuin select dropdown. It takes an array of strings as an input
 * and put each element in the dropdown list.
 * @param input an array of strings
 * @returns {undefined} the dropdown as html
 */
function getSelect(input) {
	let div = elementWithOneAttributes('div','id','loopReadModesStyle' );
	let select = elementWithOneAttributes('select','id','loopReadModesStyleSelect' );
	input.forEach((item)=>{
		let temp = elementWithOneAttributes('option', 'value',item);
		temp.innerHTML = item;
		select.append(temp);
	})
	div.append(select);
	return div;
}

/**
 * This function fetch a json file from the Server, save it in the global variable config and calls build.
 * If the JSON file is empty or an Error happens it just calls build() with ['LOOP'] and the bar with it scaling
 * functionality is build.
 */
 function fetchStyles(url) {

	fetch(url)
		.then(r =>{
			r.json()
				.then(r => {
					if(r.StyleID.length === 0){
						build(['LOOP']);
					}else {
						config =r;
						build(r);
					}
				});
		});
}

/**
 * This function creates the buttons for adjusting the text size.
 * @returns {HTMLDivElement}
 */
function getScale() {
	let wrapper 	= elementWithOneAttributes('div', 'id', 'loopReadModesFont');
	let smallText 	= elementWithOneAttributes('button', 'id', 'smallText');
	let normalText 	= elementWithOneAttributes('button', 'id', 'normalText');
	let largeText 	= elementWithOneAttributes('button', 'id', 'largeText');
	smallText.innerHTML = 'A-';
	normalText.innerHTML = 'A';
	largeText.innerHTML = 'A+';
	wrapper.append(smallText);
	wrapper.append(normalText);
	wrapper.append(largeText);
	return wrapper;
}

/**
 * This functon set the select dropdown to the activ style if it is read out of a cookie.
 * @param style the name of the active style
 */
function setSelect(style) {
	let select = document.getElementById('loopReadModesStyleSelect');
	select.value=style;
}

/**
 * This function takes a Keyword and checks if the keyword appears in the config variable.
 * If so it takes the URL out of the config variable and creates link tag with the URL.
 * Before the tag is put in the DOM, it checkt if a custom Style is already in the DOM and remove it.
 * For this reason the id 'LoopReadModesStyleSheet' is used.
 * @param style the chosen style
 */
function updateStyle(style) {
	config.Style.forEach(temp=>{
		if(style === temp.name){
			styleURL = temp.url;
			if(!search){
				styleURL = '.'+styleURL;
			}
			let stylesheet = document.createElement('link');
			stylesheet.setAttribute('rel', 'stylesheet');
			stylesheet.setAttribute('type', "text/css");
			stylesheet.setAttribute('href', styleURL);
			stylesheet.setAttribute('id', 'LoopReadModesStyleSheet');
			if(!!document.getElementById('LoopReadModesStyleSheet')) {
				document.getElementById('LoopReadModesStyleSheet').remove();
			}
			document.getElementsByTagName('head')[0].append(stylesheet);
			document.cookie = "style="+ style;
			setSelect(style);
		}
	});

}

/**
 * This function change the font-size of all p tags to a given px number.
 * @param pSize the px size of the p.
 */
function changeP(pSize) {
	let pElement = document.getElementsByTagName('p');
	for (let i=0;i < pElement.length;i++) {
		pElement[i].setAttribute('style', 'font-size:'+pSize+'px;')
		document.cookie="textSize="+pSize;
	}
}

/**
 * This function puts the events on the element of the ReadModesBar.
 */
function addListener() {
	let styles = document.getElementById('loopReadModesStyleSelect');
 	styles.onchange = (event)=>{
	 	updateStyle( styles.value.toString());
 	};
	let smallText = document.getElementById('smallText');
	smallText.onclick = (event) =>{
		textSize--;
		changeP(textSize);
	}
	let normalText = document.getElementById('normalText');
	normalText.onclick = (event) =>{
		textSize = 16;
		changeP(textSize);
	}
	let largeText = document.getElementById('largeText');
	largeText.onclick = (event) =>{
		textSize++;
		changeP(textSize);
	}
}

/**
 * This function creates a dom element with one attributes and values.
 * @param tag the kind of the tag
 * @param attribut name of the attribut
 * @param value value of the attribut
 * @returns {*} the dom element
 */
function  elementWithOneAttributes(tag, attribut, value,){
	let t = document.createElement(tag);
	t.setAttribute(attribut, value);
	return t;
}

/**
 * That is the first function how get called after the file is on the Client.
 */
(()=>{
	if(!window.location.href.split('?')[1]){
		fetchStyles(configURL);}
	else {
		search = true;
		fetchStyles(altConfigURL);
	}
})();
