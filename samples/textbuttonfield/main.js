"use strict";
/// <reference path="../../era/era.d.ts" />
class Logs extends Ui.VBox {
    constructor() {
        super();
        this.append(new Ui.Label({ text: 'Logs:', horizontalAlign: 'left', fontWeight: 'bold' }));
        let scrolling = new Ui.ScrollingArea();
        this.append(scrolling, true);
        this.logs = new Ui.VBox();
        scrolling.content = this.logs;
    }
    log(text, color) {
        if (color == undefined)
            color = 'black';
        this.logs.prepend(new Ui.Label({ text: text, color: color, horizontalAlign: 'left' }));
    }
}
class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox({ padding: 50, spacing: 10 });
        this.content = vbox;
        vbox.append(new Ui.TextButtonField({
            buttonIcon: 'search', textHolder: 'Search',
            onchanged: e => logs.log(`change: ${e.value}`),
            onvalidated: e => logs.log(`validate: ${e.value}`, 'green')
        }));
        let logs = new Logs();
        vbox.append(logs, true);
    }
}
new App();
