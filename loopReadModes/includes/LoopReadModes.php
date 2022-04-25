<?php
/**
 * @description
 */

if ( !defined( 'MEDIAWIKI' ) ) die ( "This file cannot be run standalone.\n" );

class LoopReadModes
{

    public static function onExtensionLoad()
    {

    }

    /**
     * @param $out das sind die Inhalte aus dem MW – was da als Text dinnen sethet
     * @param $skin
     * @return void
     */

    public static function onBeforePageDisplay( $out, $skin)
    {
        $out->addModules( ['extension.LoopReadModes.js', 'extension.LoopReadModes']);

    }
}