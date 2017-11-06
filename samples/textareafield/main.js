"use strict";
/// <reference path="../../era/era.d.ts" />
var app = new Ui.App();
var tf = new Ui.TextAreaField();
tf.verticalAlign = Ui.VerticalAlign.center;
tf.horizontalAlign = Ui.HorizontalAlign.center;
tf.width = 200;
tf.height = 100;
tf.textHolder = 'Type text here';
app.setContent(tf);
