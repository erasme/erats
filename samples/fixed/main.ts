/// <reference path="../../era/era.d.ts" />

//
// The fixed allow children to be absolute positionned
//

let app = new Ui.App();

let fixed = new Ui.Fixed();
app.content = fixed;

let r1 = new Ui.Rectangle({ fill: 'black', width: 50, height: 50, radius: 8 });
fixed.append(r1, 20, 20);

let r2 = new Ui.Rectangle({ fill: 'orange', width: 50, height:  50, radius: 8 });
fixed.append(r2, 40, 40);

let r3 = new Ui.Rectangle({ fill: 'purple', width: 50, height: 50, radius: 8 });
fixed.append(r3, 60, 60);

