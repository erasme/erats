"use strict";
/// <reference path="../../era/era.d.ts" />
var app = new Ui.App();
var tb = new Ui.ToolBar();
tb.verticalAlign = Ui.VerticalAlign.top;
app.setContent(tb);
var button1 = new Ui.Button();
button1.setText('button1');
tb.append(button1);
app.connect(button1, 'press', function () { return console.log('press button1'); });
var button2 = new Ui.Button();
button2.setText('button2');
app.connect(button2, 'press', function () { return console.log('press button2'); });
tb.append(button2);
