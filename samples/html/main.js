"use strict";
/// <reference path="../../era/era.d.ts" />
class App extends Ui.App {
    constructor() {
        super();
        let mainvbox = new Ui.VBox();
        this.content = mainvbox;
        let toolbar = new Ui.ToolBar();
        mainvbox.append(toolbar);
        toolbar.append(new Ui.CheckBox({
            text: 'selectable',
            ontoggled: () => html.selectable = true,
            onuntoggled: () => html.selectable = false
        }));
        let vbox = new Ui.VBox({ verticalAlign: 'center' });
        mainvbox.append(vbox, true);
        vbox.append(new Ui.Rectangle({
            fill: 'lightblue', height: 10
        }));
        let hbox = new Ui.HBox({ horizontalAlign: 'center' });
        vbox.append(hbox);
        hbox.append(new Ui.Rectangle({
            fill: 'lightblue', width: 10
        }), true);
        let html = new Ui.Html({
            width: 100,
            html: 'Have fun with HTML, I <b>hope</b> the text is enough long',
            selectable: false
        });
        hbox.append(html, false);
        hbox.append(new Ui.Rectangle({
            fill: 'lightblue', width: 10
        }), true);
        vbox.append(new Ui.Rectangle({
            fill: 'lightblue', height: 10
        }));
    }
}
new App();
