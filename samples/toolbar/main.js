"use strict";
/// <reference path="../../era/era.d.ts" />
var app = new Ui.App();
var tb = new Ui.ToolBar({ verticalAlign: 'top' });
app.content = tb;
tb.append(new Ui.Button({
    text: 'button1',
    onpressed: function () { return console.log('press button1'); }
}));
tb.append(new Ui.Button({
    text: 'button2',
    onpressed: function () { return console.log('press button2'); }
}));
