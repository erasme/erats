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
}

let app = new Ui.App();

let vbox = new Ui.VBox({ spacing: 10, margin: 5 });
app.content = vbox;

let hbox = new Ui.HBox({ spacing: 10 });
vbox.append(hbox);

let textfield = new Ui.TextField({ textHolder: 'Text Holder' });
hbox.append(textfield, true);

app.connect(textfield, 'change', (tfield: Ui.TextField, value: string) => logs.log(`change: ${value}`));

let getButton = new Ui.Button({ text: 'get text' });
hbox.append(getButton);

app.connect(getButton, 'press', () =>
	logs.log(`get text: ${textfield.value}`, 'blue')
);

let logs = new Logs();
vbox.append(logs, true);

