<?php
/**
 * @description Diese Datei stellt eine
 * @author Andreas Kißmehl
 */

/* Check ob ein MediaWiki vohanden ist oder */
if ( !defined( 'MEDIAWIKI' ) ) die ( "This file cannot be run standalone.\n" );

/**
 * Dies Klasse LoopReadModes stellt zwei function zur verfügung welche notwendig sind um ein Div in den Dom zu hängen
 * und um CSS Daten und JavaScripte den Seiten hinzuzufügen.
 */
class LoopReadModes
{
	/**
	 * Diese function wird zu beginn von MediaWiki ausgeführt und muss für ein funktionierendes Plugin vorhanden sein.
	 * @return void
	 */
    public static function onExtensionLoad(){}

    /**
	 * Der verwendete Hook BeforePageDisplay wird mit der function onBeforePageDisplay gerufen und fügt das notwendige JavaScript und die CSS datei hinzu.
     * @param $out * OutputPage object.
     * @param $skin * Skin object that will be used to generate the page.
     * @return void
     */

    public static function onBeforePageDisplay( $out, $skin)
    {
		$out->addModules( ['extension.LoopReadModes.js', 'extension.LoopReadModes']);
    }
}
