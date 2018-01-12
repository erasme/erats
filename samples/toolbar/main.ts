/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

let tb = new Ui.ToolBar({ verticalAlign: 'top' });
app.content = tb;

tb.append(new Ui.Button({
    text: 'button1',
    onpressed: () => console.log('press button1')
}));

tb.append(new Ui.Button({
    text: 'button2',
    onpressed: () => console.log('press button2')
}));
