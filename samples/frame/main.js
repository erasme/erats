"use strict";
/// <reference path="../../era/era.d.ts" />
//
// Play with Ui.Frame, the basic drawing element
//
var app = new Ui.App();
var frame = new Ui.Frame();
frame.fill = new Ui.LinearGradient([
    { offset: 0, color: new Ui.Color(0.2, 0.5, 0.2) },
    { offset: 0.5, color: new Ui.Color(0.9, 0.1, 0.1) },
    { offset: 1, color: new Ui.Color(0.1, 0.8, 0.9) }
], Ui.Orientation.vertical);
frame.margin = 50;
frame.radius = 16;
frame.radiusTopLeft = 8;
frame.radiusBottomRight = 0;
frame.frameWidth = 5;
app.setContent(frame);
