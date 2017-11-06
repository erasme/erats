"use strict";
/// <reference path="../../era/era.d.ts" />
//
// Play with Ui.VBox, the element allow vertical stacking
//
var app = new Ui.App();
var vbox1 = new Ui.VBox();
app.setContent(vbox1);
// create a 20 tall rectangle. The default packing behavior of element
// is to stretch the available size. In this case, the width will be
// stretched to the parent vbox width
var r1 = new Ui.Rectangle();
r1.fill = 'orange';
r1.height = 20;
vbox1.append(r1);
// the second argument (true) specify that the vbox can use this
// rectangle to fill all the available space
var r2 = new Ui.Rectangle();
r2.fill = 'lightgreen';
vbox1.append(r2, true);
// unlike the first rectangle, specify that we want this element
// to be horizontaly centered
var r3 = new Ui.Rectangle();
r3.fill = 'brown';
r3.width = 100;
r3.height = 20;
r3.horizontalAlign = Ui.HorizontalAlign.center;
vbox1.append(r3);
