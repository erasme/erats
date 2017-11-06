/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

let tf = new Ui.TextAreaField();
tf.verticalAlign = Ui.VerticalAlign.center;
tf.horizontalAlign = Ui.HorizontalAlign.center;
tf.width = 200; tf.height = 100;
tf.textHolder = 'Type text here';

app.setContent(tf);

