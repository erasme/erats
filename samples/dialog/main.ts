/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();
		let vbox = new Ui.VBox();
		this.setContent(vbox);

		let tb = new Ui.HBox();
		vbox.append(tb);

		tb.append(new Ui.Button({ text: 'test 1' }));
		tb.append(new Ui.Button({ text: 'test 2' }));

		let button = new Ui.Button({
			text: 'Open dialog',
			verticalAlign: 'center', horizontalAlign: 'center'
		});
		vbox.append(button, true);

		this.connect(button, 'press', () => {
			let dialog = new Ui.Dialog({
				title: 'Test Dialogue',
				cancelButton: new Ui.DialogCloseButton({ text: 'Annuler' }),
				actionButtons: [
					new Ui.Button({ text: 'Previous' }),
					new Ui.Button({ text: 'Next' })
				],
				content: new Ui.Rectangle({ fill: 'lightgreen', width: 350, height: 200 })
			});
			dialog.open();
		});
	}
}

new App();
