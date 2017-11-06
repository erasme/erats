/// <reference path="../../era/era.d.ts" />

class Logs extends Ui.ScrollingArea {
    logs: Ui.VBox;

    constructor() {
        super();
        let vbox = new Ui.VBox();
        vbox.spacing = 10;
        this.setContent(vbox);
        let l = new Ui.Label(); l.text = 'Logs:';
        l.horizontalAlign = Ui.HorizontalAlign.left;
        l.fontWeight = 'bold';
		vbox.append(l);
		this.logs = new Ui.VBox();
		vbox.append(this.logs);
	}

	log(text: string, color?: Ui.Color | string) {
		if(color == undefined)
            color = 'black';
        let l = new Ui.Label();
        l.text = text; l.color = color; l.horizontalAlign = Ui.HorizontalAlign.left;
		this.logs.prepend(l);
	}
}

let app = new Ui.App();

let vbox = new Ui.VBox();
vbox.spacing = 10; vbox.margin = 5;
app.setContent(vbox);

let hbox = new Ui.HBox();
hbox.spacing = 10;
vbox.append(hbox);

let textfield = new Ui.TextField();
textfield.textHolder ='Text Holder';
hbox.append(textfield, true);

app.connect(textfield, 'change', (tfield: Ui.TextField, value: string) => logs.log(`change: ${value}`));

let getButton = new Ui.Button();
getButton.setText('get text');
hbox.append(getButton);

app.connect(getButton, 'press', function() {
	logs.log(`get text: ${textfield.value}`, 'blue');
});

let logs = new Logs();
vbox.append(logs, true);

