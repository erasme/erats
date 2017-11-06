/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

let tb = new Ui.ToolBar();
tb.verticalAlign = Ui.VerticalAlign.top;
app.setContent(tb);

let button1 = new Ui.Button();
button1.setText('button1');
tb.append(button1);
app.connect(button1, 'press', () => console.log('press button1'));
let button2 = new Ui.Button();
button2.setText('button2');
app.connect(button2, 'press', () => console.log('press button2'));
tb.append(button2);