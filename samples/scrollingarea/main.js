"use strict";
/// <reference path="../../era/era.d.ts" />
var app = new Ui.App();
var vbox = new Ui.VBox();
app.content = vbox;
var tb = new Ui.ToolBar();
vbox.append(tb);
var topLeftButton = new Ui.Button({
    text: 'top left',
    onpressed: function () { return scl.setOffset(0, 0); }
});
tb.append(topLeftButton);
var bottomRightButton = new Ui.Button({
    text: 'bottom right',
    onpressed: function () { return scl.setOffset(1, 1); }
});
tb.append(bottomRightButton);
var scl = new Ui.ScrollingArea();
vbox.append(scl, true);
var grid = new Ui.Grid({ cols: 'auto,auto,auto', rows: 'auto,auto,auto' });
scl.content = grid;
var rect1 = new Ui.Rectangle({ width: 200, height: 400, fill: 'lightgreen' });
grid.attach(rect1, 0, 0);
var rect2 = new Ui.Rectangle({ width: 200, height: 400, fill: 'lightblue' });
grid.attach(rect2, 0, 1);
var rect3 = new Ui.Rectangle({ width: 200, height: 400, fill: 'purple' });
grid.attach(rect3, 1, 0);
var button4 = new Ui.Button({
    width: 200, height: 200, text: 'fun',
    onpressed: function () { return console.log('grid button press'); }
});
grid.attach(button4, 1, 1);
var rect5 = new Ui.Rectangle({ width: 400, height: 400, fill: 'pink' });
grid.attach(rect5, 2, 0);
grid.attach(new Ui.TextAreaField(), 2, 1);
var rect7 = new Ui.Rectangle({ width: 200, height: 400, fill: 'orange' });
grid.attach(rect7, 0, 2, 3, 1);
