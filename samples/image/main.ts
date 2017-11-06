/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

let image = new Ui.Image();
image.verticalAlign = Ui.VerticalAlign.center;
image.horizontalAlign = Ui.HorizontalAlign.center;
image.src = 'image.png';
app.setContent(image);

