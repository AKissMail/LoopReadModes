/**
 * This script puts an additional bar on top of a loop system.
 * @author Andreas Kißmehl
 * @version 1.0
 * @param config Global variable for the Config object after it is fetched from the Server.
 * @param modesURL The URI of the current Stylesheet
 * @currentMode The Current Style
 * @textSize The current TextSize
 * @configURL  URI of the Configuration file
 */
let 	config;
let 	modeURL;
let 	currentMode = getCookie("mode");
let 	textSize = getCookie("textSize");
let 	normalTextSize = 16;
let 	textSizeChange = (getCookie(textSize) !== "textSizeChange");
const 	server = mw.config.get( 'wgServer')+"/" + mw.config.get( 'wgScriptPath' );
const 	configURL=  mw.config.get( 'wgServer' ) + "/" + mw.config.get( 'wgScriptPath' ) + "/extensions/LoopReadModes/modes/modes.json";
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
function build() {
	console.log(config);
	console.log(modeURL);
	console.log(currentMode);
	console.log(textSize);
	console.log(textSizeChange);
	console.log(server);
	console.log(configURL);
	let barWrapper = elementWithOneAttributes('div', 'id','rmBar');
	barWrapper.append(getScale());
	barWrapper.append(getSelect());
	document.getElementById('banner-logo-container').append(barWrapper);
	(currentMode)?console.log('currentMode true'):false;
	console.log(currentMode);
	(currentMode)? updateMode(currentMode):console.log('currentMode false');
	(textSize) ? changeTextSize(textSize):console.log('changeTextSize false');
	(textSize) ?console.log('changeTextSize true'):false;
	(!textSize) ? textSize = 16:console.log('textSize 16 false');
}
/**
 * This function creates a Button in a Div and Set an EventListener.
 * @returns {*}
 */
function getSelect(){
	let div = elementWithOneAttributes('div', 'id', 'rmModes');
	let button = elementWithTowAttributesAndInnerHTML('button','id', 'rmClose', 'class', 'rmBtn material-icons','style');
	button.addEventListener('click', selectDropDown);
	div.append(button);
	return div;
}
/**
 * This function checks if a specific button has the ID rmClose or Open.
 * Depending on the case it will add or remove the button's and set a new id.
 */
function selectDropDown(){
	let div = document.getElementById('rmModes');
	let btn = document.getElementById('rmClose');
	let altBtn = document.getElementById('rmOpen');
	(!btn)? removeElementByID('rmDropdown'):false;
	(!btn)? altBtn.setAttribute('id','rmClose'):false;
	(btn)? div.append(getModeButtons(config)):false;
	(btn)? btn.setAttribute('id','rmOpen'):false;
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
function getModeButtons (input){
	let data = input.modes;
	let div = elementWithOneAttributes('div','id','rmDropdown');
	for(let i= 0; i <data.length; i++){
		let button = elementWithThreeAttributes('button','id',  data[i].name,'style', 'background:'+data[i].preViewBackground+'; color:'+ data[i].preView, 'class', 'dropdownBtn');
		button.addEventListener('click',()=>{updateMode(data[i].name)});
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
function fetchModes(url,) {
	fetch(url)
		.then(r =>{
			r.json()
				.then(r => {
					if(r.length === 0){
						console.log('LOOP');
						build(['LOOP']);
					}else {
						console.log(config);
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
	let wrapper 	= elementWithOneAttributes('div', 'id', 'rmScale');
	let smallText 	= elementWithTowAttributesAndInnerHTML('button', 'id', 'smallText', 'class', 'rmBtn', 'A-');
	let normalText 	= elementWithTowAttributesAndInnerHTML('button', 'id', 'normalText', 'class', 'rmBtn', 'A');
	let largeText 	= elementWithTowAttributesAndInnerHTML('button', 'id', 'largeText', 'class', 'rmBtn', 'A+');
	smallText.addEventListener('click',  ()=>{textSize--;    textSizeChange = true;		changeTextSize(textSize);});
	normalText.addEventListener('click', ()=>{textSize = normalTextSize; textSizeChange = false;	changeTextSize(textSize);});
	largeText.addEventListener('click',  ()=>{textSize++;  	 textSizeChange = true;		changeTextSize(textSize);});
	wrapper.append(smallText);
	wrapper.append(normalText);
	wrapper.append(largeText);
	return wrapper;
}
/**
 * This function takes a Keyword and checks if the keyword appears in the config objekt.
 * If so it takes the URL out of the config objekt and creates link tag with the URL.
 * Before the tag is put in the DOM, it checkt if a custom Style is already in the DOM and remove it.
 * For this reason the id 'modeURL' is used.
 * @param modeName the chosen style
 */
function updateMode(modeName) {
	config.modes.forEach(temp=>{
		if(modeName === temp.name){
			normalTextSize = temp.textSize;
			modeURL = server + temp.url;
			let stylesheet = elementWithFourAttributes('link', 'rel', 'stylesheet', 'type', 'text/css', 'href', modeURL, 'id', 'modeURL');
			(document.getElementById('modeURL'))? document.getElementById('modeURL').remove():false;
			(document.getElementById('rmOpen'))? removeElementByID('rmDropdown'):false;
			(document.getElementById('rmOpen'))? document.getElementById('rmOpen').setAttribute('id', 'rmClose'):false;
			document.getElementsByTagName('head')[0].append(stylesheet);
			(!textSize)?changeTextSize(temp.textSize):false;
			document.cookie = "mode="+ modeName+"; SameSite=None; Secure";
		}
	});
}
/**
 * This function change the font-size of all p, li, th, td, caption tags to a given px number.
 * The given number is saved in a cookie called 'textSize'.
 * @param size the px size of the p, li, th, caption and td.
 */
function changeTextSize(size) {
	document.cookie="textSize="+size +"; SameSite=None; Secure";
	let pElement = document.getElementsByTagName('p');
	let liElement = document.getElementsByTagName('li');
	let thElement = document.getElementsByTagName('th');
	let tdElement = document.getElementsByTagName('td');
	let captionElement = document.getElementsByTagName('caption');
	loop(pElement, calculateSize(pElement.length),size);
	loop(liElement, liElement.length,size)
	loop(thElement, thElement.length,size);
	loop(tdElement, tdElement.length,size);
	loop(captionElement, captionElement.length,size);

	function calculateSize(length) {
		if(length ===1||2||3){return 1}
		else{return length-4}
	}
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
			array[i].setAttribute('style', 'font-size:'+size+'px;');
		}
	}else if(array.length > 0) {
		array.setAttribute('style', 'font-size:'+size+'px;');
	}
}
/**
 * This function creates a dom element with one attributes and values.
 * @param tag the kind of the tag
 * @param attribut name of the attribut
 * @param value value of the attribut
 * @returns {*} the dom element
 */
function elementWithOneAttributes(tag, attribut, value,){
	let t = document.createElement(tag);
	t.setAttribute(attribut, value);
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
 * This function creates and returns an DOM-Element after given parameters.
 * @param tag Type of the Dom-Element
 * @param attribut1 name of the attribut1
 * @param value1 value of the attribut1
 * @param attribut2 name of the attribut2
 * @param value2 value of the attribut2
 * @param attribut3 name of the attribut3
 * @param value3 value of the attribut3
 * @param attribut4 name of the attribut4
 * @param value4 value of the attribut4
 * @returns {*} the DOM-Element
 */
function elementWithFourAttributes(tag, attribut1, value1,attribut2, value2,attribut3, value3, attribut4, value4) {
	let t = document.createElement(tag);
	t.setAttribute(attribut1, value1,);
	t.setAttribute(attribut2, value2);
	t.setAttribute(attribut3, value3);
	t.setAttribute(attribut4, value4);
	return t;
}
/**
 * That is the first function how get called after the file is fetch in the Client.
 */
(()=>{
	fetchModes(configURL);
})();
