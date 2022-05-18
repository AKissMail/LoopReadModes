/**
 * @author Andreas Kißmehl
 */
let 	config; 										// Global variable for the Config object after it is fetched from the Server.
let 	styleURL;										// The URI of the current Stylesheet
let 	currentStyle = getCookie("style");	// the Current Style.
let 	textSize = getCookie("textSize");	// The current TextSize
let 	search = false; 								// boolean to determined wich hook is use. true = onSpecialSearchResultsAppend; false = onBeforePageDisplay;
const 	configURL= "./extensions/LoopReadModes/modes/modes.json"; // URI of the Configuration file.

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
 * This function set up the menubar and put it in the dom. todo hier nochmal die beiden Button Gruppen zusammen fassen. Ich habe den Zweck von build über 5 Function verteilt
 */
function build() {
	let barWrapper = elementWithOneAttributes('div', 'id','loopReadModesBar');
	let typoScale = getScale();
	let style = getSelect();
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
 * This function creates a Button in a Div and Set an EventListener. todo
 * @returns {*}
 */
function getSelect(){
	let div = elementWithOneAttributes('div', 'id', 'loopReadModesStyle');
	let button = elementWithTowAttributesAndInnerHTML('button','id', 'loopReadModesStyleButtonClose', 'class', 'rmBtn','Modes');
	button.addEventListener('click', selectDropDown);
	div.append(button);
	return div;
}
/**
 * This function checks if a specific button has the ID loopReadModesStyleButtonClose or Open.
 * Depending on the case it will add or remove the button's and set a new id.
 */
function selectDropDown(){
	let div = document.getElementById('loopReadModesStyle');
	let btn = document.getElementById('loopReadModesStyleButtonClose');
	let altBtn = document.getElementById('loopReadModesStyleButtonOpen');
	if(!btn){
		removeElementByID('loopReadModesStyleButtons');
		altBtn.setAttribute('id','loopReadModesStyleButtonClose');
	}
	else {
		div.append(getSelectButtens(config));
		btn.setAttribute('id','loopReadModesStyleButtonOpen')
	}
}
/**
 * This function removes Elements from the DOM with a given id.
 * @param id the id of the Element that will be removed from the Dom.
 */
function removeElementByID(id) {
	document.getElementById(id).remove();
}
/**
 * This function creates a Dropdown out of Buttons.
 * Ths Dropdown is created after the config Objekt what is stored in the config variable.
 */
function getSelectButtens (input){
	let data = input.Style;
	let div = elementWithOneAttributes('div','id','loopReadModesStyleButtons');
	for(let i= 0; i <data.length; i++){
		let button = elementWithThreeAttributes('button','id',  data[i].name,'style', 'background:'+data[i].preViewBackground+'; color:'+ data[i].preView, 'class', 'dropdownBtn');

		button.addEventListener('click',()=>{updateStyle(data[i].name)});
		button.innerHTML= data[i].name;
		div.append(button);
	}
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
						config = r;
						build(r);
					}
				});
		});
}
/**
 * This function creates the buttons for adjusting the text size.
 * @returns An Div with the three Buttons.
 */
function getScale() {
	let wrapper 	= elementWithOneAttributes('div', 'id', 'loopReadModesFont');
	let smallText 	= elementWithTowAttributesAndInnerHTML('button', 'id', 'smallText', 'class', 'rmBtn', 'A-');
	let normalText 	= elementWithTowAttributesAndInnerHTML('button', 'id', 'normalText', 'class', 'rmBtn', 'A');
	let largeText 	= elementWithTowAttributesAndInnerHTML('button', 'id', 'largeText', 'class', 'rmBtn', 'A+');
	wrapper.append(smallText);
	wrapper.append(normalText);
	wrapper.append(largeText);
	return wrapper;
}
/**
 * This function takes a Keyword and checks if the keyword appears in the config objekt.
 * If so it takes the URL out of the config objekt and creates link tag with the URL.
 * Before the tag is put in the DOM, it checkt if a custom Style is already in the DOM and remove it.
 * For this reason the id 'LoopReadModesStyleSheet' is used.
 * @param style the chosen style
 */
function updateStyle(style) {
	config.Style.forEach(temp=>{
		if(style === temp.name){
			styleURL = temp.url;
			changeP(temp.textSize);
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
			document.cookie = "style="+ style+"; SameSite=None; Secure";
			document.getElementById('loopReadModesStyleButtonOpen').setAttribute('id','loopReadModesStyleButtonClose');
			removeElementByID('loopReadModesStyleButtons');
		}
	});
}
/**
 * This function change the font-size of all p, li, th, td, caption tags to a given px number.
 * The given number is saved in a cookie called 'textSize'.
 * @param pSize the px size of the p, li, th, caption and td.
 */
function changeP(pSize) {
	document.cookie="textSize="+pSize +"; SameSite=None; Secure";
	let pElement = document.getElementsByTagName('p');
	let liElement = document.getElementsByTagName('li');
	let thElement = document.getElementsByTagName('th');
	let tdElement = document.getElementsByTagName('td');
	let captionElement = document.getElementsByTagName('caption');
	loop(pElement, pElement.length-3,pSize);
	loop(liElement, liElement.length,pSize)
	loop(thElement, thElement.length,pSize);
	loop(tdElement, tdElement.length,pSize);
	loop(captionElement, captionElement.length,pSize);
}
/**
 * This function is a for loop that goes over an Array of html elements and set an inline Style 'font-size'.
 * If an empty Array is given as a parameter it will do nothing and if a single element is given as a parameter it will set the inline Style.
 * @param array input array with the html elements
 * @param workLength the part of the array what should be change
 * @param size size of the font
 */
function loop(array, workLength, size){
	if(workLength){
		for (let i=0;i < workLength;i++) {
			array[i].setAttribute('style', 'font-size:'+size+'px!important;');
		}
	}else if(array >0) {
		array.setAttribute('style', 'font-size:'+size+'px!important;');
	}
}
/**
 * This function puts the events on the element of the ReadModesBar. todo
 */
function addListener() {
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
 * This function creates and returns an DOM-Element after given parameters.
 * @param tag Type of the Dom-Element
 * @param attribut1 name of the attribut1
 * @param value1 value of the attribut1
 * @param attribut2 name of the attribut2
 * @param value2 value of the attribut2
 * @returns {*} the DOM-Element
 */
function  elementWithTowAttributes(tag, attribut1, value1,attribut2, value2){
	let t = document.createElement(tag);
	t.setAttribute(attribut1, value1);
	t.setAttribute(attribut2, value2);
	return t;
}
/**
 * This function creates and returns an DOM-Element after given parameters and puts content inside.
 * @param tag Type of the Dom-Element
 * @param attribut1 name of the attribut1
 * @param value1 value of the attribut1
 * @param attribut2 name of the attribut2
 * @param value2 value of the attribut2
 * @param innerHTML the value of the Content
 * @returns {*} the DOM-Element
 */
function elementWithTowAttributesAndInnerHTML(tag, attribut1, value1,attribut2, value2, innerHTML) {
	let t = document.createElement(tag);
	t.setAttribute(attribut1, value1);
	t.setAttribute(attribut2, value2);
	t.innerHTML = innerHTML;
	return t;
}
/**
 * This function creates and returns an DOM-Element after given parameters.
 * @param tag Type of the Dom-Element
 * @param attribut1 name of the attribut1
 * @param value1 value of the attribut1
 * @param attribut2 name of the attribut2
 * @param value2 value of the attribut2
 * @param attribut3 name of the attribut3
 * @param value3 value of the attribut3
 * @returns {*} the DOM-Element
 */
function elementWithThreeAttributes(tag, attribut1, value1,attribut2, value2,attribut3, value3){
	let t = document.createElement(tag);
	t.setAttribute(attribut1, value1,);
	t.setAttribute(attribut2, value2);
	t.setAttribute(attribut3, value3);
	return t;
}
/**
 * That is the first function how get called after the file is fetch in the Client.
 */
(()=>{
	if(!window.location.href.split('?')[1]){
		search = false;
		fetchStyles('.'+configURL);}
	else {
		search = true;
		fetchStyles(configURL);
	}
})();
