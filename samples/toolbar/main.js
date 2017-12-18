"use strict";
/// <reference path="../../era/era.d.ts" />
var app = new Ui.App();
var tb = new Ui.ToolBar({ verticalAlign: 'top' });
app.content = tb;
var button1 = new Ui.Button({ text: 'button1' });
tb.append(button1);
app.connect(button1, 'press', function () { return console.log('press button1'); });
var button2 = new Ui.Button({ text: 'button2' });
app.connect(button2, 'press', function () { return console.log('press button2'); });
tb.append(button2);
