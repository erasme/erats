/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Label, the simplest text element
//

let app = new Ui.App();

let label = new Ui.Label();
label.text = 'hello world';
label.verticalAlign = 'center';
label.horizontalAlign = 'center';

app.setContent(label);
