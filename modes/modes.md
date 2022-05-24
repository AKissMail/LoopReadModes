#Comments to the file modes.json
*This is a version of the extension.json File with some explanations. You can find the original file at ./extension.json*

The JSON contains an Array of modes objects. Each mode has the flowing parameters: 
* name: That is the Name of the Mode. It will appear in the dropdown menu.
* url: That is the url of the CSS file. Be aware it will be complete from the MediaWiki. Start with "/extension"!
* textSize: That is the default TextSize. It can be adjusted by the user.
* preViewBackground: That is the background color of the button. It should be the main background color of the Mode.
* preView: That is the color of the Text in the Button. It should match the color of the Text in the Mode. 
```
{   
    "Style" : [
```
This is the default object with the following values:
```
        {
            "name": "LOOP",
            "url": "",
            "textSize": 16,
            "preViewBackground": "#526ca2",
            "preView": "#ffffff"
        },
```
That is an additional Mode. 
```
        {
            "name": "LRS",
            "url": "/extensions/LoopReadModes/modes/css/lrs.css",
            "textSize": 26,
            "preViewBackground": "#EDD1B0",
            "preView": "#black"
        }
    ]
}
```
