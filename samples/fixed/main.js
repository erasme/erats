"use strict";
/// <reference path="../../era/era.d.ts" />
//
// The fixed allow children to be absolute positionned
//
var app = new Ui.App();
var fixed = new Ui.Fixed();
app.setContent(fixed);
var r1 = new Ui.Rectangle();
r1.fill = 'black';
r1.width = 50;
r1.height = 50;
r1.radius = 8;
fixed.append(r1, 20, 20);
var r2 = new Ui.Rectangle();
r2.fill = 'orange';
r2.width = 50;
r2.height = 50;
r2.radius = 8;
fixed.append(r2, 40, 40);
var r3 = new Ui.Rectangle();
r3.fill = 'purple';
r3.width = 50;
r3.height = 50;
r3.radius = 8;
fixed.append(r3, 60, 60);
