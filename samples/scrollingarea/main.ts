/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

let vbox = new Ui.VBox();
app.setContent(vbox);

let tb = new Ui.ToolBar();
vbox.append(tb);

let topLeftButton = new Ui.Button({ text: 'top left' });
tb.append(topLeftButton);
app.connect(topLeftButton, 'press', function() {
	scl.setOffset(0, 0);
});

let bottomRightButton = new Ui.Button({ text: 'bottom right' });
tb.append(bottomRightButton);
app.connect(bottomRightButton, 'press', function() {
	scl.setOffset(1, 1);
});

let scl = new Ui.ScrollingArea();
vbox.append(scl, true);

let grid = new Ui.Grid({ cols: 'auto,auto,auto', rows: 'auto,auto,auto' });
scl.content = grid;

let rect1 = new Ui.Rectangle({ width: 200, height: 400, fill: 'lightgreen' });
grid.attach(rect1, 0, 0);

let rect2 = new Ui.Rectangle({ width: 200, height: 400, fill: 'lightblue' });
grid.attach(rect2, 0,1);

let rect3 = new Ui.Rectangle({ width: 200, height: 400, fill: 'purple' });
grid.attach(rect3, 1,0);

let button4 = new Ui.Button({ width: 200, height: 200, text: 'fun' });
grid.attach(button4, 1, 1);
app.connect(button4, 'press', function() {
	console.log('grid button press'); 
});

let rect5 = new Ui.Rectangle({ width: 400, height: 400, fill: 'pink' });
grid.attach(rect5, 2,0);

grid.attach(new Ui.TextAreaField(), 2, 1);

let rect7 = new Ui.Rectangle({ width: 200, height: 400, fill: 'orange' });
grid.attach(rect7, 0, 2, 3, 1);