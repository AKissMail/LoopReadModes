

import {fetchStyles} from './fetch.js';


export function build(cookie) {
	let styles = fetchStyles();
	let firstDiv = document.createElement('div');
	let secondDiv = document.createElement('div');
	let thirdDiv = document.createElement('div');
	firstDiv.setAttribute('id','loopReadModesBar');
	secondDiv.setAttribute('id', 'loopReadModesFont');
	thirdDiv.setAttribute('id', 'loopReadModesStyle');
	// hier muss jetzt das was aus fetchStyles kommt hinzugefügt werden.

}
