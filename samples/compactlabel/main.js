"use strict";
/// <reference path="../../era/era.d.ts" />
var app = new Ui.App();
var compactlabel = new Ui.CompactLabel();
compactlabel.verticalAlign = Ui.VerticalAlign.center;
compactlabel.horizontalAlign = Ui.HorizontalAlign.center;
compactlabel.textAlign = 'center';
compactlabel.maxLine = 4;
compactlabel.width = 100;
compactlabel.text = "very long piece of text withsuperunsplittedword to see\n what happend when text is too long really too long";
app.setContent(compactlabel);
