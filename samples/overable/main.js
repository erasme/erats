"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let overable = new Ui.Overable({
            verticalAlign: 'center', horizontalAlign: 'center',
            onentered: () => {
                console.log('enter');
                label.show();
            },
            onleaved: () => {
                console.log('leave');
                label.hide();
            }
        });
        this.content = overable;
        let lbox = new Ui.LBox({ width: 400, height: 400 });
        overable.append(lbox);
        lbox.append(new Ui.Rectangle({ fill: 'lightgreen' }));
        lbox.append(new Ui.Rectangle({ fill: 'purple', margin: 50 }));
        lbox.append(new Ui.Rectangle({ fill: 'orange', margin: 100 }));
        lbox.append(new Ui.Button({ text: 'CLICK', margin: 20, verticalAlign: 'bottom' }));
        let label = new Ui.Label({
            verticalAlign: 'center',
            horizontalAlign: 'center',
            text: 'is over',
            fontWeight: 'bold',
            fontSize: 20
        });
        label.hide();
        lbox.append(label);
    }
}
new App();
