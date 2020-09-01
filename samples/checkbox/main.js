"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox();
        this.content = vbox;
        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        let checkbox = new Ui.CheckBox({
            verticalAlign: 'center', horizontalAlign: 'center',
            width: 200, text: 'check me'
        });
        vbox.append(checkbox, true);
        let button = new Ui.Button({
            text: 'check',
            onpressed: () => checkbox.value = true
        });
        toolbar.append(button);
        button = new Ui.Button({
            text: 'uncheck',
            onpressed: () => checkbox.value = false
        });
        toolbar.append(button);
        button = new Ui.Button({
            text: 'enable',
            onpressed: () => checkbox.enable()
        });
        toolbar.append(button);
        button = new Ui.Button({
            text: 'disable',
            onpressed: () => checkbox.disable()
        });
        toolbar.append(button);
    }
}
new App();
