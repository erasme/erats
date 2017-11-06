"use strict";
/// <reference path="../../era/era.d.ts" />
var app = new Ui.App();
var shape = new Ui.Shape();
shape.width = 48;
shape.height = 48;
shape.fill = 'orange';
shape.path = 'm 9.2,24 7,-7 7,7 14,-14 7,7 -21,21 z';
shape.verticalAlign = Ui.VerticalAlign.center;
shape.horizontalAlign = Ui.HorizontalAlign.center;
app.setContent(shape);
