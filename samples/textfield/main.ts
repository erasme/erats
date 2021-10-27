/// <reference path="../../era/era.d.ts" />

class Logs extends Ui.ScrollingArea {
    logs: Ui.VBox;

    constructor() {
        super();
        let vbox = new Ui.VBox({ spacing: 10 });
        this.content = vbox;
        vbox.append(new Ui.Label({ text: 'Logs:', horizontalAlign: 'left', fontWeight: 'bold' }));
        this.logs = new Ui.VBox();
        vbox.append(this.logs);
    }

    log(text: string, color: Ui.Color | string = 'black') {
        this.logs.prepend(new Ui.Label({
            text: text, color: color, horizontalAlign: 'left'
        }));
    }

    clear() {
        this.logs.clear();
    }
}


class App extends Ui.App {
    constructor() {
        super();

        let vbox = new Ui.VBox({ spacing: 10, margin: 5 });
        this.content = vbox;

        let toolbar = new Ui.ToolBar();
        vbox.append(toolbar);

        let hbox = new Ui.HBox({ spacing: 10 });
        vbox.append(hbox);

        let textfield = new Ui.TextField({
            textHolder: 'Text Holder',
            onchanged: e => logs.log(`change: ${e.value}`)
        });
        hbox.append(textfield, true);

        let getButton = new Ui.Button({
            text: 'get text',
            onpressed: () => logs.log(`get text: ${textfield.value}`, 'blue')
        });
        toolbar.append(getButton);

        let typeButton = new Ui.Combo().assign({
            title: 'Changer le type de l\'input',
            data: [
                {value: 'text' }, {value: 'checkbox' }, {value: 'color' }, {value: 'date' }, {value: 'datetime-local' },
                {value: 'file' }, {value: 'hidden' }, {value: 'image' }, {value: 'month' }, {value: 'number' }, {value: 'password' },
                {value: 'radio' }, {value: 'range' }, {value: 'reset' }, {value: 'search' }, {value: 'submit' }, {value: 'tel' },
                {value: 'button' }, {value: 'time' }, {value: 'url' }, {value: 'week' }, {value: 'email' }
            ], field: 'value', position: 0,
            onchanged: (e) => {
                textfield.type = e.value.value;
                logs.log(`change type: ${textfield.type}`, 'blue');
            }
        });
        toolbar.append(typeButton);

        let inputModeButton = new Ui.Combo().assign({
            title: 'Changer l\'input mode de l\'input',
            data: [
                {value: 'text' }, {value: 'none' }, {value: 'decimal' }, {value: 'numeric' }, {value: 'tel' },
                {value: 'search' }, {value: 'email' }, {value: 'url' }
            ], field: 'value', position: 0,
            onchanged: (e) => {
                textfield.inputMode = e.value.value;
                logs.log(`change inputMode: ${textfield.inputMode}`, 'blue');
            }
        });
        toolbar.append(inputModeButton);

        let clearLogButton = new Ui.Button({
            text: 'clear logs',
            onpressed: () => logs.clear()
        });

        toolbar.append(clearLogButton);

        let logs = new Logs();
        vbox.append(logs, true);

    }
}

new App();
