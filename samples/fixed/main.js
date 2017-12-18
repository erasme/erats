"use strict";
/// <reference path="../../era/era.d.ts" />
//
// The fixed allow children to be absolute positionned
//
var app = new Ui.App();
var fixed = new Ui.Fixed();
app.content = fixed;
var r1 = new Ui.Rectangle({ fill: 'black', width: 50, height: 50, radius: 8 });
fixed.append(r1, 20, 20);
var r2 = new Ui.Rectangle({ fill: 'orange', width: 50, height: 50, radius: 8 });
fixed.append(r2, 40, 40);
var r3 = new Ui.Rectangle({ fill: 'purple', width: 50, height: 50, radius: 8 });
fixed.append(r3, 60, 60);
