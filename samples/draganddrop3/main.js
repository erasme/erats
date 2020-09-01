"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let rect = new Ui.Rectangle();
        let drop = new Ui.Rectangle();
        this.content = new Ui.VBox().assign({
            verticalAlign: 'center', horizontalAlign: 'center',
            spacing: 20,
            content: [
                rect.assign({ fill: 'red', width: 100, height: 100, horizontalAlign: 'center' }),
                drop.assign({ fill: 'green', width: 200, height: 200 })
            ]
        });
        new Ui.DraggableWatcher({
            element: rect,
            data: rect,
            start: () => Ui.Toast.send('Drag start'),
            end: (watcher, effect) => Ui.Toast.send(`Drag end effect: ${effect}`)
        });
        new Ui.DropableWatcher({
            element: drop,
            onentered: () => drop.fill = 'orange',
            onleaved: () => drop.fill = 'green',
            ondropped: (w, d, e) => { console.log('DROP ' + e); return true; },
            types: [
                { type: Ui.Rectangle, effects: 'copy' }
            ]
        });
    }
}
new App();
