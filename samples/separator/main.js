"use strict";
/// <reference path="../../era/era.d.ts" />
var app = new Ui.App();
var vbox = new Ui.VBox();
vbox.verticalAlign = Ui.VerticalAlign.center;
vbox.horizontalAlign = Ui.HorizontalAlign.center;
app.setContent(vbox);
var label1 = new Ui.Label();
label1.text = 'first line';
vbox.append(label1);
vbox.append(new Ui.Separator());
var label2 = new Ui.Label();
label2.text = 'second line';
vbox.append(label2);
