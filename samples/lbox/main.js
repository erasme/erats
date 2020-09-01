"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let lbox = new Ui.LPBox();
        this.content = lbox;
        lbox.prepend(new Ui.Rectangle().assign({
            fill: 'orange', marginLeft: 40, marginTop: 40, marginBottom: 120, marginRight: 120
        }));
        lbox.prependAtLayer(new Ui.Rectangle().assign({
            fill: 'pink', marginLeft: 60, marginTop: 60, marginBottom: 100, marginRight: 100
        }), 2);
        lbox.prepend(new Ui.Rectangle().assign({
            fill: 'green', marginLeft: 80, marginTop: 80, marginBottom: 80, marginRight: 80
        }));
        lbox.prependAtLayer(new Ui.Rectangle().assign({
            fill: 'purple', marginLeft: 100, marginTop: 100, marginBottom: 60, marginRight: 60
        }), 2);
    }
}
new App();
