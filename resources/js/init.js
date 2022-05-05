/**
 * This file is contains to function how get called when the script is loaded in the client.
 * @author Andreas Kißmehl
 */
let config;
let styleURL;
const configURL= "../extensions/LoopReadModes/modes/modes.json";
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
 * This function fetch a json file from the Server and calls build.
 * If nothing is in the JSON file or an Error happens it just calls build with ['LOOP'].
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
 * @todo
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
 * @todo
 * Hier soll ein neues Stylesheet eingehängt werden...
 * @returns {undefined}
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
 * @todo
 * Hier werden die Listener gesetzt.
 */
function addListener(c) {
 	//console.log(config.LRS.styleURL);
	let styles = document.getElementById('loopReadModesStyleSelect');
 	styles.onchange= (event)=>{
		let dropdownValue = styles.value.toString();
	 	console.log(dropdownValue);
		 updateStyle(dropdownValue);
 	};
	 // @todo hier muss noch der Listener für die Skalierung hin.
}


/**
 * That is the first function how get called after the file is on the Client.
 */
(()=>{
	fetchStyles();
})();
