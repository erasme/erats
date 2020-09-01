"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox().assign({ verticalAlign: 'center', horizontalAlign: 'center' });
        this.content = vbox;
        let data = [];
        for (let i = 0; i < 25; i++)
            data.push({ text: 'item ' + i, id: i });
        let combo = new Ui.Combo().assign({
            field: 'text', data: data, placeHolder: 'choice...', search: true
        });
        vbox.append(combo);
        combo.changed.connect(e => {
            console.log('Combo change: ' + e.value.text);
            Ui.Toast.send(e.value.text);
        });
    }
}
new App();
//# sourceMappingURL=main.js.map