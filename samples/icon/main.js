"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let fbox = new Ui.Flow().assign({
            margin: 40, spacing: 20, uniform: true
        });
        this.content = fbox;
        let colors = ['lightblue', 'pink', 'lightgreen'];
        for (var i = 0; i < Ui.Icon.getNames().length; i++) {
            let vbox = new Ui.VBox().assign({ spacing: 5 });
            vbox.append(new Ui.Icon().assign({
                icon: Ui.Icon.getNames()[i],
                horizontalAlign: 'center',
                width: 48, height: 48,
                fill: colors[i % colors.length]
            }));
            vbox.append(new Ui.Label().assign({
                horizontalAlign: 'center',
                text: Ui.Icon.getNames()[i]
            }));
            fbox.append(vbox);
        }
    }
}
new App();
