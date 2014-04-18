/*\
title: $:/core/modules/widgets/keyboard-snippets.js
type: application/javascript
module-type: widget

Edit-text widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var EditTextWidget = require("$:/core/modules/widgets/edit-text.js")["edit-text"];

/*
The edit-text widget calls this method just after inserting its dom nodes
*/
EditTextWidget.prototype.postRender = function() {
	var self = this;
	var domNode = self.domNodes[0];
	this.KEYMAP = this.wiki.getTiddlerData("$:/plugins/danielo/keyboardSnippets/KEYMAP");
	$tw.utils.addEventListeners(domNode,[
		{name: "keydown", handlerObject: this, handlerMethod: "insertAtCursor"}
	]);


};


EditTextWidget.prototype.createKeySnippet = function(preTag,postTag){
 return {pre:preTag, post:postTag, length:preTag.length+postTag.length };
};


EditTextWidget.prototype.getKeyName = function (keyCode){
  return this.KEYMAP[keyCode];
};



//EDIT OR DELETE THIS FUNCTION!!!!
EditTextWidget.prototype.parseKeyBindings = function (keyCombinations){
for(comb in keyCombinations){


}

};




EditTextWidget.prototype.composeKeyCombo = function (event){
var keyCombo="";

            if(event.ctrlKey)keyCombo+="ctrl+";
            if(event.shiftKey)keyCombo+="shift+";
			if(event.altKey)keyCombo+="alt+";
			keyCombo+=this.getKeyName(event.keyCode);

return keyCombo;

};



EditTextWidget.prototype.insertAtCursor = function (event) {
    var myValue="";
    var myField;
if (event.srcElement)  myField = event.srcElement;
 else if (event.target) myField = event.target;

 var keySnippets = {

 "ctrl+b" : this.createKeySnippet("''","''"), //b -- bold
 "ctrl+i" : this.createKeySnippet("//","//"), //i --italics
 "ctrl+o" : this.createKeySnippet("\n#"," "), //o -- Ordered list
 "ctrl+u" : this.createKeySnippet("__","__"), //u -- understrike list
 "ctrl+k" : this.createKeySnippet("\n```\n","```"), //k -- code
 "ctrl+s" : this.createKeySnippet(",,",",,"), //s -- subscript
 "ctrl+l" : this.createKeySnippet("\n*"," "), //l -- list

};

//keySnippets=JSON.parse(this.wiki.getTiddlerAsJson("$:/keyboard/snippets")).text || keySnippets;

 if(myValue=keySnippets[this.composeKeyCombo(event)] )
  //para evitar sobreescribir otros eventos solo reaccionamos ante combinaciones que
  //estén en nuestro map de keySnippets
 {
            event.preventDefault();
			event.stopPropagation();
            //myValue=keySnippets[this.getKeyName(event.keyCode)];

        //Internet explorer
            if (document.selection) {
                myField.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
            }
            //MOZILLA and others
            else if (myField.selectionStart || myField.selectionStart == '0') {
                var startPos = myField.selectionStart;
                var endPos = myField.selectionEnd;
                var selected=myField.value.substring(startPos,endPos);
                console.log("Sel Start: "+startPos+" Ends at "+ endPos);
                myField.value = myField.value.substring(0, startPos)
                    + myValue.pre + selected + myValue.post
                    + myField.value.substring(endPos, myField.value.length);

                var middle=Math.round((myValue.length/2));
                console.log(middle);
                myField.selectionStart = startPos + middle;
                myField.selectionEnd = startPos + middle;
            } else {
                myField.value += myValue;
            }

    this.saveChanges(this.domNodes[0].value);
    }
};

})();