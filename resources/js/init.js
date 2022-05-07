/**
 * This file is contains to function how get called when the script is loaded in the client.
 * @author Andreas Kißmehl
 */
let config; 	// Global variable for the Config object after it is fetched from the Server.
let styleURL;	// The URI of the current Stylesheet
let textSize = 16;
const configURL= "../extensions/LoopReadModes/modes/modes.json"; // URI of the Configfile.
/**
 * That function checks if a Cookie is already set with a preferred style and return that name of the style.
 * If the function fond nothing the sting 'default' is returned.
 * @returns {string} the name of the style
 * @todo put in place
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
	return "LOOP";
}

/**
 * This function set up the menubar and put it in the dom.
 */
function build(input) {
	console.log(input);
	console.log('build');
	let barWrapper = document.createElement('div');
	let typoScale = getScale();
	let style = getSelect(input.StyleID);
	barWrapper.setAttribute('id','loopReadModesBar');
	barWrapper.append(typoScale);
	barWrapper.append(style);
	document.getElementById('banner-logo-container').append(barWrapper);
	addListener();
}
/**
 * This function set up a genuin select dropdown. It takes an array of strings as an input
 * and put each element in the dropdown list.
 * @param input an array of strings
 * @returns {undefined} the dropdown as html
 * @todo check auf Barrierefreiheit
 */
function getSelect(input) {
	let div = document.createElement('div');
	div.setAttribute('id', 'loopReadModesStyle');
	let select = document.createElement('select');
	select.setAttribute('id', 'loopReadModesStyleSelect')
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
 * This function fetch a json file from the Server, save it in the global variable config and calls build.
 * If the JSON file is empty or an Error happens it just calls build() with ['LOOP'] and the bar with it scaling
 * functionality is build.
 */
 function fetchStyles() {
	fetch(configURL)
		.then(r =>{
			r.json()
				.then(r => {
					console.log(r.StyleID);
					if(r.StyleID.length === 0){
						build(['LOOP']);
					}else {
						config =r;
						build(r);
					}
				});
		}).catch(err =>{
		build(['LOOP']);
		console.log('fetch failed!: ' + err.message);
	});
}

/**
 * Darus soll mal eine auswahl zu der größe von der Schrift werden.
 * @returns {HTMLDivElement}
 * @todo update das Icons angezeigt werden und Text labels gesetzt werden
 */
function getScale() {
	let wrapper = 	 document.createElement('div');
	let smallText =  document.createElement('div');
	let normalText = document.createElement('div');
	let largeText =  document.createElement('div');
	wrapper.setAttribute('id', 'loopReadModesFont');
	smallText.setAttribute('id', 'smallText');
	normalText.setAttribute('id','normalText');
	largeText.setAttribute('id', 'largeText');
	wrapper.append(smallText);
	wrapper.append(normalText);
	wrapper.append(largeText);
	return wrapper;
}

/**
 * This function takes a Keyword and checks if the keyword appears in the config variable.
 * If so it takes the URL out of the config variable and creates link tag with the URL.
 * Before the tag is put in the DOM, it checkt if a custom Style is already in the DOM and remove it.
 * For this reason the id 'LoopReadModesStyleSheet' is used.
 */
function updateStyle(style) {
	config.Style.forEach(temp=>{
		if(style === temp.name){
			console.log(temp.url);
			styleURL = temp.url;
			let stylesheet = document.createElement('link');
			stylesheet.setAttribute('rel', 'stylesheet');
			stylesheet.setAttribute('type', "text/css");
			stylesheet.setAttribute('href', styleURL);
			stylesheet.setAttribute('id', 'LoopReadModesStyleSheet');
			if(!!document.getElementById('LoopReadModesStyleSheet')) {
				document.getElementById('LoopReadModesStyleSheet').remove();
			}
			document.getElementsByTagName('head')[0].append(stylesheet);
		}
	});

}

/**
 * This function change the font-size of all p tags to a given px number.
 * @param pSize the px size of the p.
 */
function changeP(pSize) {
	let pElement = document.getElementsByTagName('p');
	for (let i=0;i <= pElement.length;i++) {
		pElement[i].setAttribute('style', 'font-size:'+pSize+'px;')
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
		textSize= textSize-1;
		changeP(textSize);
	}
	let normalText = document.getElementById('normalText');
	normalText.onclick = (event) =>{
		textSize = 16;
		changeP(textSize);
	}
	let largeText = document.getElementById('largeText');
	largeText.onclick = (event) =>{
		textSize = textSize+1;
		changeP(textSize);
	}
}


/**
 * That is the first function how get called after the file is on the Client.
 */
(()=>{
	fetchStyles();
})();
