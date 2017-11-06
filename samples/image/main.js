"use strict";
/// <reference path="../../era/era.d.ts" />
var app = new Ui.App();
var image = new Ui.Image();
image.verticalAlign = Ui.VerticalAlign.center;
image.horizontalAlign = Ui.HorizontalAlign.center;
image.src = 'image.png';
app.setContent(image);
