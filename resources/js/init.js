/**
 * This file is contains to function how get called when the script is loaded in the client.
 * @author Andreas Kißmehl
 */
import {build} from "./html";
/**
 * That is the first function how get called after the file is on the Client.
 */
(()=>{
	build(getCookie());
})();

/**
 * That function checks if a Cookie is already set with a preferred style and return that name of the style.
 * If the function fond nothing the sting 'default' is returned.
 * @returns {string} the name of the style
 * @todo
 */
function getCookie() {
	return 'standard'
}
