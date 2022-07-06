<?php
/**
 * @description This file is the base for the LoopReadModes Extension. It contains three functions to handle the used
 * hooks.
 * @author Andreas Kißmehl
 * @version 0.1
 */

/* This is a check if the file runs in a MediaWiki */
if ( !defined( 'MEDIAWIKI' ) ) die ( "This file cannot be run standalone.\n" );

class LoopReadModes
{
	/**
	 * This function is mandatory by MediaWiki. It runs when MediaWiki starts and does nothing.
	 * @return void
	 */
    public static function onExtensionLoad(){}

    /**
	 * The used BeforePageDisplay hook is handled in this function. It adds a JavaScript module and a CSS file to the
	 * output that is sent to the client.
     * @param $out * OutputPage object.
     * @return void
     */
    public static function onBeforePageDisplay( $out, $skin )
    {
		$out->addModules( [ 'extension.LoopReadModes.js', 'extension.LoopReadModes' ] );
    }

	/**
	 * The used BeforePageDisplay hook is handled in this function. It adds a JavaScript module and a CSS file to the
     * output that is sent to the client.
	 * @param $output * OutputPage object.
	 * @return void
	 */
	public static function onSpecialSearchResultsAppend( $specialSearch, $output, $term )
	{
		$output->addModules( [ 'extension.LoopReadModes.js', 'extension.LoopReadModes' ] );
	}
}
