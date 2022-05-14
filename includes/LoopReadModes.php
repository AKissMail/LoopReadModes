<?php
/**
 * @description This file is the base for the LoopReadModes Extension. It contains three functions to handle the used hooks.
 * @author Andreas Kißmehl
 * @version 0.1
 */

/* That is a Check if the file runs in a MediaWiki*/
if ( !defined( 'MEDIAWIKI' ) ) die ( "This file cannot be run standalone.\n" );

class LoopReadModes
{
	/**
	 * This function is mandatory by mediaWiki. It runs when MediaWiki starts and it will do nothing.
	 * @return void
	 */
    public static function onExtensionLoad(){}

    /**
	 * The used BeforePageDisplay Hook is handled in this function. It adds a JavaScript Modul and a CSS file to the output what is send to the Client.
     * @param $out * OutputPage object.
     * @return void
     */

    public static function onBeforePageDisplay( $out, $skin)
    {
		$out->addModules( ['extension.LoopReadModes.js', 'extension.LoopReadModes']);
    }

	/**
	 * The used BeforePageDisplay Hook is handled in this function. It adds a JavaScript Modul and a CSS file to the output what is send to the Client.
	 * @param $output * OutputPage object.
	 * @return void
	 */
	public static function onSpecialSearchResultsAppend($specialSearch, $output, $term)
	{
		$output->addModules( ['extension.LoopReadModes.js', 'extension.LoopReadModes']);
	}
}
