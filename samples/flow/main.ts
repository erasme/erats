/// <reference path="../../era/era.d.ts" />

let app = new Ui.App();

let flow = new Ui.Flow();
flow.spacing = 10;
app.setContent(flow);

let r = new Ui.Rectangle();
r.width = 150; r.height = 150; r.fill = 'pink';
flow.append(r);

r = new Ui.Rectangle();
r.width = 100; r.height = 50; r.fill = 'purple'; r.verticalAlign = Ui.VerticalAlign.center;
flow.append(r);

r = new Ui.Rectangle();
r.width = 150; r.height = 150; r.fill = 'brown';
flow.append(r);

r = new Ui.Rectangle();
r.width = 200; r.height = 15; r.fill = 'orange';
flow.append(r);

r = new Ui.Rectangle();
r.width = 150; r.height = 150; r.fill = 'lightblue';
flow.append(r);