"use strict";
/// <reference path="../../era/era.d.ts" />
//
// Play with Ui.Button, the normal looking button
//
class App extends Ui.App {
    constructor() {
        super();
        let locator = new Ui.Locator().assign({
            path: '/Fun/Apps/Here/There/Everywhere',
            verticalAlign: 'center', horizontalAlign: 'center',
            onchanged: e => {
                console.log('path change: ' + e.path);
                Ui.Toast.send('path change: ' + e.path);
            }
        });
        this.content = locator;
    }
}
new App();
