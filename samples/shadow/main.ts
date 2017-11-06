/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Shadow, the basic drawing element
//

let app = new Ui.App();

let lbox = new Ui.LBox();
lbox.verticalAlign = Ui.VerticalAlign.center;
lbox.horizontalAlign = Ui.HorizontalAlign.center;
app.setContent(lbox);

let rect1 = new Ui.Rectangle();
rect1.fill = '#cccccc';
lbox.append(rect1);

let shadow1 = new Ui.Shadow();
shadow1.width = 100;
shadow1.height = 100;
shadow1.shadowWidth = 5;
shadow1.radius = 8;
shadow1.inner = true;
shadow1.opacity = 0.5;
shadow1.color = Ui.Color.create('red');
shadow1.margin = 30;
lbox.append(shadow1);
