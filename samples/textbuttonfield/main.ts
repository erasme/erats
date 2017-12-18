/// <reference path="../../era/era.d.ts" />

class Logs extends Ui.VBox {
    logs: Ui.VBox;

    constructor() {
        super();
		this.append(new Ui.Label({ text: 'Logs:', horizontalAlign: 'left', fontWeight: 'bold' }));
		let scrolling = new Ui.ScrollingArea();
		this.append(scrolling, true);
		this.logs = new Ui.VBox();
		scrolling.content = this.logs;
	}

	log(text: string, color?: string) {
		if(color == undefined)
			color = 'black';
		this.logs.prepend(new Ui.Label({ text: text, color: color, horizontalAlign: 'left' }));
	}
}

class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox({ padding: 50, spacing: 10 });
        this.content = vbox;

        let textbuttonfield = new Ui.TextButtonField({ buttonIcon: 'search', textHolder: 'Search' });
        vbox.append(textbuttonfield);

        this.connect(textbuttonfield, 'change', (tbf: Ui.TextButtonField, value: string) =>
            logs.log('change: ' + value)
        );

        this.connect(textbuttonfield, 'validate', (tbf: Ui.TextButtonField) =>
            logs.log('validate: ' + textbuttonfield.value, 'green')
        );

        let logs = new Logs();
        vbox.append(logs, true);
    }
}

new App();