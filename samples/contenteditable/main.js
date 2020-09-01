"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let scroll = new Ui.ScrollingArea();
        this.content = scroll;
        let vbox = new Ui.VBox();
        scroll.content = vbox;
        vbox.append(new Ui.Rectangle({ fill: 'orange', height: 350 }));
        let lbox = new Ui.LBox({ horizontalAlign: 'center', verticalAlign: 'center' });
        vbox.append(lbox);
        lbox.append(new Ui.Rectangle({ fill: 'lightblue' }));
        let html = new Ui.ContentEditable({
            horizontalAlign: 'center', width: 200, margin: 5,
            html: 'Have fun with HTML, I <b>hope</b> the text is enough long'
        });
        html.selectable = true;
        lbox.append(html);
        vbox.append(new Ui.Rectangle({ fill: 'orange', height: 350 }));
    }
}
new App();
