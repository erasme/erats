"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        this.content = new Ui.VBox().assign({
            content: [
                new Ui.HBox().assign({
                    content: [
                        new Ui.Button().assign({ text: 'test 1' }),
                        new Ui.Button().assign({ text: 'test 2' })
                    ]
                }),
                new Ui.Button().assign({
                    text: 'Open dialog', resizable: true,
                    verticalAlign: 'center', horizontalAlign: 'center',
                    onpressed: () => {
                        let dialog = new Ui.Dialog({
                            title: 'Test Dialog',
                            actionButtons: [
                                new Ui.Button().assign({ text: 'Previous' }),
                                new Ui.Button().assign({ text: 'Next' })
                            ],
                            content: new Ui.Rectangle().assign({ fill: 'lightgreen', width: 350, height: 200 })
                        });
                        dialog.open();
                    }
                })
            ]
        });
    }
}
new App();
