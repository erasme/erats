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
        let vbox = new Ui.VBox();
        this.content = vbox;
        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);
        toolbar.append(new Ui.Button({
            text: 'get date',
            onpressed: () => {
                let date = datepicker.selectedDate;
                if (date == undefined)
                    logs.log('date is undefined');
                else
                    logs.log('date: ' + date);
            }
        }));
        let hbox = new Ui.HBox();
        vbox.append(hbox, true);
        let datepicker = new Ui.DatePicker({ verticalAlign: 'center', horizontalAlign: 'center', dayFilter: [0, 6] });
        hbox.append(datepicker, true);
        let logs = new Logs();
        hbox.append(logs, true);
    }
}
new App();
