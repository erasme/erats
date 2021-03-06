"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        this.drawing.addEventListener('pointerdown', (event) => {
            let el = Ui.Element.elementFromPoint(new Ui.Point(event.clientX, event.clientY));
            console.log('pointerdown at: ' + event.clientX + ',' + event.clientY + ' found: ' +
                el);
            Ui.Toast.send(`${el}`);
        }, true);
        let vbox = new Ui.VBox({ spacing: 10, margin: 10 });
        this.content = vbox;
        vbox.append(new Ui.Button({ text: 'Click me', icon: 'star' }));
        vbox.append(new Ui.Rectangle({ fill: 'purple', height: 100 }));
        vbox.append(new Ui.Text({ text: 'Some text sample' }));
    }
}
new App();
