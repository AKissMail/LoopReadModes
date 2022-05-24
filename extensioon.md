# Comments to the file extension.json
*This is a version of the extension.json File with some explanations. You can find the original file at ./extension.json*

At the file start with some basic information about the extension.
* name: The name of the extension.
* type: Type of the extension.
* author: The author of the extension.
* version: The version of the extension.
* url: The url of the repository of the extension.
* description: A short description of the extension.
* license-name: The name of the license.
```
{
	"name" : "LoopReadModes",
	"type" : "other",
	"author" : ["Andreas Kißmehl"],
	"version" : "0.1.0",
	"url": "https://github.com/AKissMail/mediawiki-skins-Loop-readmode",
	"description" : "This extension makes Pages in Loop more accessible for users that have special needs",
	"license-name" : "GPL-3.0",
```
The next block contains the dependencies of the extension. 
* MediaWiki: Version of the required MediaWiki.
* extensions: List of extensions that are required.
* manifest_version: Defines if the extension is backward compatible with the old extension paradigm of MediaWiki. 2 means no. 
```
	"requires" : {
		"MediaWiki": ">= 1.35",
		"extensions": {
			"Loop": ">=2.1.0"
		}
	},
	"manifest_version" : 2
```
* MessagesDirs: The definition of the messages file. 
```
	"MessagesDirs": {
	"LoopReadModes": ["i18n"]
	},
```
* callback: That is the callback function wich will be excluded when the extension is registered by mediawiki.
```
	"callback" : "LoopReadModes::onExtensionLoad",
```
* AutoloadClasses: That is the path to the php file wich includes the function for the start of the extension and the handler function of the hooks. 
```
	"AutoloadClasses": {
		"LoopReadModes": "includes/LoopReadModes.php"
	},
```
That are the definition of the used hooks with the name of the handler function in the LoopReadModes.php file. 
The name of the handler function start after the '::'.  
```
	"Hooks" :{
		"BeforePageDisplay" :["LoopReadModes::onBeforePageDisplay"],
		"SpecialSearchResultsAppend":["LoopReadModes::onSpecialSearchResultsAppend"]
	},
```


That is the definition of modules that can be access by a hook. A CSS file and a JavaScript file is defined in this example. 
* ResourceFileModulePaths: A required, but used, parameter.
* ResourceModules: The definition of the modules that will be loaded when a hook is called. 
```
	"ResourceFileModulePaths": {
		"localBasePath": ""
	},
	"ResourceModules": {
		"extension.LoopReadModes": {
			"styles": "/resources/css/loopReadModesMenu.css"
		},
		"extension.LoopReadModes.js": {
			"position": "bottom",
			"scripts": ["/resources/js/init.js"],
			"messages": []
		}
	}
}
```
