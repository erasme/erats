"use strict";
/// <reference path="../../era/era.d.ts" />
//
// Play with Ui.Label, the simplest text element
//
var app = new Ui.App();
var label = new Ui.Label();
label.text = 'hello world';
label.setVerticalAlign(Ui.VerticalAlign.center);
label.setHorizontalAlign(Ui.HorizontalAlign.center);
app.setContent(label);
