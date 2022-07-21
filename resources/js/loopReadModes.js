/**
 * This script puts an additional bar on top of a loop system.
 * @author Andreas Kißmehl
 * @version 1.0
 * @param config Global variable for the config object after it is fetched from the server
 * @param modesURL The URI of the current stylesheet
 * @param currentMode The current style
 * @param textSize The current text size
 * @param normalTextSize The normal text size (fallback)
 * @param textSizeChange boolean true= a custom text size is set
 * @param server URI of the server
 * @param configURL  URI of the configuration file
 */
let 	config;
let 	modeURL;
let 	currentMode = getCookie ( "mode" );
let 	textSize = getCookie ( "textSize" );
let 	normalTextSize = 16;
let 	textSizeChange = ( getCookie ( textSize ) !== "textSizeChange" );
const 	server = mw.config.get ( 'wgServer' )+ "/" + mw.config.get ( 'wgScriptPath' );
const 	configURL=  server + "/extensions/LoopReadModes/modes/modes.json";

/**
 * This function checks if a cookie is already set with a preferred style and returns the name of the style.
 * If the function found nothing the string '' is returned.
 * @returns {string} the name of the style
 */
function getCookie ( cookieName ) {
	let name = cookieName + "=";
	let cookieArray = decodeURIComponent ( document.cookie );
	let cookieArraySplit = cookieArray.split(';');
	for ( let i = 0; i < cookieArraySplit.length; i++ ) {
		let returnValue = cookieArraySplit[i];
		while ( returnValue.charAt(0) === ' ' ) {
			returnValue = returnValue.substring( 1 );
		}
		if ( returnValue.indexOf( name ) === 0 ) {
			return returnValue.substring( name.length, returnValue.length );
		}
	}
	return "";
}

/**
 * This function sets up the menu bar and inserts it into the DOM.
 */
function build () {

	( currentMode )? updateMode ( currentMode ):false;
	( textSize ) ? changeTextSize ( textSize ):false;
	( !textSize ) ? textSize = 16 :false;
	let barWrapper = elementWithOneAttributes ('div', 'id','rmBar' );
	barWrapper.append ( getScale () );
	barWrapper.append ( getSelect () );
	document.getElementById ( 'banner-logo-container' ).append ( barWrapper );

}

/**
 * This function creates a button in a div and sets an EventListener.
 * @returns {*} the div
 */
function getSelect(){
	let div = elementWithOneAttributes ( 'div', 'id', 'rmModes' );
	let button = elementWithThreeAttributesAndInnerHTML ( 'button','id', 'rmClose', 'class', 'rmBtn material-icons','title', 'Kontrast Modus auswählen','style' );
	button.addEventListener ( 'click', selectDropDown );
	div.append( button );
	return div;
}

/**
 * This function checks if a specific button has the ID rmClose or Open.
 * Depending on the case it will add or remove the button and set a new id.
 */
function selectDropDown (){
	let div = document.getElementById ( 'rmModes' );
	let btn = document.getElementById ( 'rmClose' );
	let altBtn = document.getElementById ( 'rmOpen' );
	(!btn)? removeElementByID ( 'rmDropdown' ) :false;
	(!btn)? altBtn.setAttribute ( 'id','rmClose' ) :false;
	(btn)? div.append ( getModeButtons ( config ) ) :false;
	(btn)? btn.setAttribute ( 'id','rmOpen' ) :false;
}

/**
* This function removes elements from the DOM with a given ID.
* @param id the ID of the element that will be removed from the Dom.
*/
function removeElementByID ( id ) {
	document.getElementById ( id ).remove();
}

/**
 * This function creates a dropdown of buttons.
 * This dropdown is created after the config object that is stored in the config variable.
 * @param input the config file
 * @returns {*} a html element with the buttons and EventListener for the dropdown
 */
function getModeButtons ( input ){
	let data = input.modes;
	let div = elementWithOneAttributes ( 'div','id','rmDropdown' );
	for( let i= 0; i <data.length; i++ ) {
		let button = elementWithFourAttributes ('button','id',  data[i].name,'style', 'background:'+data[i].preViewBackground+'; color:'+ data[i].preView, 'class', 'dropdownBtn','title', data[i].name );
		button.addEventListener ('click', ()=>{ updateMode ( data[i].name ) } );
		button.innerHTML= data[i].name;
		div.append ( button );
	}
	return div;
}

/**
 * This function fetches a json file from the server, saves it in the global variable config and calls build().
 * If the JSON file is empty or an error happens it just calls build() with ['LOOP'] and the bar with its scaling
 * functionality is build.
 * @param url of the config file
 */
function fetchModes ( url ) {
	fetch ( url )
		.then ( r =>{
			r.json ()
				.then ( r => {
					if ( r.length === 0 ){
						console.log( 'fetchModes failed or modes.json is empty' );
					}else {
						config = r;
						build ();
					}
				});
		});
}

/**
 * This function creates the buttons for adjusting the text size.
 * @returns An Div with the three Buttons.
 */
function getScale () {
	let wrapper 	= elementWithOneAttributes ( 'div', 'id', 'rmScale' );
	let smallText 	= elementWithThreeAttributesAndInnerHTML ( 'button', 'id', 'smallText', 'class', 'rmBtn', 'title', 'Text verkleinern','A-' );
	let normalText 	= elementWithThreeAttributesAndInnerHTML ( 'button', 'id', 'normalText', 'class', 'rmBtn','title', 'Textgröße zurücksetzten', 'A' );
	let largeText 	= elementWithThreeAttributesAndInnerHTML ( 'button', 'id', 'largeText', 'class', 'rmBtn', 'title', 'Text vergrößern','A+' );
	smallText.addEventListener ( 'click',  ()=>{
		textSize--;
		textSizeChange = true;
		changeTextSize ( textSize ) ;
	} );
	normalText.addEventListener ( 'click', ()=>{
		textSize = normalTextSize;
		textSizeChange = false;
		changeTextSize ( textSize );
	} );
	largeText.addEventListener ('click',  ()=>{
		textSize++;
		textSizeChange = true;
		changeTextSize(textSize);
	} );
	wrapper.append ( smallText );
	wrapper.append ( normalText );
	wrapper.append ( largeText );
	return wrapper;
}

/**
 * This function takes a keyword and checks if the keyword appears in the config object.
 * If so, it takes the URL from the config object and creates a link tag with the URL.
 * Before inserting the tag into the DOM, it checks if a custom style already exists in the DOM and removes it.
 * For this reason the ID 'modeURL' is used.
 * @param modeName the chosen style
 */
function updateMode ( modeName ) {
	config.modes.forEach ( temp=>{
		if( modeName === temp.name ){
			normalTextSize = temp.textSize;
			modeURL = server + temp.url;
			let stylesheet = elementWithFourAttributes ( 'link', 'rel', 'stylesheet', 'type', 'text/css', 'href', modeURL, 'id', 'modeURL' );
			( document.getElementById ( 'modeURL' ) )? document.getElementById ( 'modeURL' ).remove ():false;
			( document.getElementById ( 'rmOpen' ) )? removeElementByID ( 'rmDropdown' ):false;
			( document.getElementById ( 'rmOpen' ) )? document.getElementById ( 'rmOpen' ) .setAttribute( 'id', 'rmClose' ) :false;
			document.getElementsByTagName('head')[0].append(stylesheet);
			( !textSize )?changeTextSize ( temp.textSize ) :false;
			document.cookie = "mode="+ modeName+"; SameSite=None; Secure";
		}
	} );
}

/**
 * This function changes the font size of all p, li, th, td, caption tags to a given px number.
 * The given number is saved in a cookie called 'textSize'.
 * @param size the px size of the p, li, th, caption and td.
 */
function changeTextSize ( size ) {
	document.cookie="textSize="+size +"; SameSite=None; Secure";
	let pElement = document.getElementsByTagName ( 'p' );
	let liElement = document.getElementsByTagName ( 'li' );
	let thElement = document.getElementsByTagName ( 'th' );
	let tdElement = document.getElementsByTagName ( 'td' );
	let captionElement = document.getElementsByTagName ( 'caption' );
	loop ( pElement, calculateSize ( pElement.length ) ,size );
	loop ( liElement, liElement.length, size );
	loop ( thElement, thElement.length, size ) ;
	loop ( tdElement, tdElement.length, size ) ;
	loop ( captionElement, captionElement.length, size ) ;

	/**
	 * Inner function to calculate the number of p tags that should be scaled.
	 * It avoids the scaling of the side panels.
	 * @param length the length of the document.getElementsByTagName ( 'p' ) result.
	 * @returns {number} the number of the relevant p tags.
	 */
	function calculateSize ( length ) {
		if ( length ===1||2||3 ) {
			return 1
		}
		else{
			return length-4
		}
	}
}

/**
 * This function is a for loop that goes over an array of html elements and set an inline style 'font-size'.
 * If an empty array is given as a parameter it will do nothing and if a single element is given as a parameter it will set the inline style.
 * @param array input array with the html elements
 * @param workLength the part of the array that should be change
 * @param size size of the font
 */
function loop ( array, workLength, size ) {
	if ( workLength ) {
		for ( let i=0;i < workLength;i++ ) {
			array[i].setAttribute ( 'style', 'font-size:'+size+'px;' );
		}
	} else if ( array.length > 0 ) {
		array.setAttribute ( 'style', 'font-size:'+size+'px;' );
	}
}

/**
 * This function creates a DOM element with one attribute and values.
 * @param tag the kind of the tag
 * @param attribut name of the attribut
 * @param value value of the attribut
 * @returns {*} the dom element
 */
function elementWithOneAttributes ( tag, attribut, value ) {
	let t = document.createElement ( tag );
	t.setAttribute ( attribut, value );
	return t;
}

/**
 * This function creates and returns an DOM element after given parameters and puts content inside.
 * @param tag Type of the Dom-Element
 * @param attribut1 name of the attribut1
 * @param value1 value of the attribut1
 * @param attribut2 name of the attribut2
 * @param value2 value of the attribut2
 * @param attribut3 value of the attribut3
 * @param value3 value of the attribut3
 * @param innerHTML the value of the Content
 * @returns {*} the DOM-Element
 */
function elementWithThreeAttributesAndInnerHTML ( tag, attribut1, value1,attribut2, value2, attribut3,value3, innerHTML ) {
	let t = document.createElement ( tag );
	t.setAttribute ( attribut1, value1 );
	t.setAttribute ( attribut2, value2 );
	t.setAttribute ( attribut3, value3 );
	t.innerHTML = innerHTML;
	return t;
}

/**
 * This function creates and returns an DOM element after given parameters.
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
function elementWithFourAttributes ( tag, attribut1, value1,attribut2, value2,attribut3, value3, attribut4, value4 ) {
	let t = document.createElement ( tag ) ;
	t.setAttribute (attribut1, value1 );
	t.setAttribute ( attribut2, value2 );
	t.setAttribute (attribut3, value3 );
	t.setAttribute ( attribut4, value4 );
	return t;
}

/**
 * This is the first function that is called after the file is fetched in the client.
 */
(()=>{
	fetchModes ( configURL );
})();
