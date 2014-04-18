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
	$tw.utils.addEventListeners(domNode,[
		{name: "keydown", handlerObject: this, handlerMethod: "insertAtCursor"}
	]);


};


	//DANIELO EDIT

EditTextWidget.prototype.createKeySnippet = function(preTag,postTag){
 return {pre:preTag, post:postTag, length:preTag.length+postTag.length };
};

EditTextWidget.prototype.insertAtCursor = function (event) {
    var myValue="";
    var myField;
if (event.srcElement)  myField = event.srcElement;
 else if (event.target) myField = event.target;

 var keyCodes = {

 66 : this.createKeySnippet("''","''"), //b -- bold
 73 : this.createKeySnippet("//","//"), //i --italics
 79 : this.createKeySnippet("\n#"," "), //o -- Ordered list
 85 : this.createKeySnippet("__","__"), //u -- understrike list
 75 : this.createKeySnippet("\n```\n","```"), //k -- code
 83 : this.createKeySnippet(",,",",,"), //s -- subscript
 76 : this.createKeySnippet("\n*"," "), //l -- list

};

//keyCodes=JSON.parse(this.wiki.getTiddlerAsJson("$:/keyboard/snippets")).text || keyCodes;

 if(event.ctrlKey && keyCodes[event.keyCode] )
  //para evitar sobreescribir otros eventos solo reaccionamos ante combinaciones que
  //estén en nuestro map de keycodes
 {
            event.preventDefault();
			event.stopPropagation();
            myValue=keyCodes[event.keyCode];

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