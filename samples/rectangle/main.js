"use strict";
/// <reference path="../../era/era.d.ts" />
//
// Play with Ui.Label, the simplest text element
//
var app = new Ui.App();
var rect1 = new Ui.Rectangle();
var grad1 = new Ui.LinearGradient([
    { offset: 0, color: new Ui.Color(0.2, 0.5, 0.2) },
    { offset: 0.5, color: new Ui.Color(0.9, 0.1, 0.1) },
    { offset: 1, color: new Ui.Color(0.1, 0.8, 0.9) }
], Ui.Orientation.vertical);
rect1.fill = grad1;
rect1.width = 100;
rect1.height = 100;
rect1.verticalAlign = Ui.VerticalAlign.center;
rect1.horizontalAlign = Ui.HorizontalAlign.center;
rect1.radius = 8;
app.setContent(rect1);
