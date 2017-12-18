/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
		let vbox = new Ui.VBox();
		this.content = vbox;

		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);

		let textfield = new Ui.TextField({
			verticalAlign: 'center', margin: 40, value: 'Hello World !'
		});
		vbox.append(textfield);

        let button = new Ui.Button();
        button.text = 'Send toast';
		this.connect(button, 'press', function() {
			Ui.Toast.send(textfield.value);
		});
		toolbar.append(button);

		let delayButton = new Ui.Button({ text: 'Send delayed toast' });
		this.connect(delayButton, 'press', () => {
			new Core.DelayedTask(2, () => Ui.Toast.send(textfield.value+' DELAY'));
		});
		toolbar.append(delayButton);

        let dialogButton = new Ui.Button();
        dialogButton.text = 'Open dialog';
		this.connect(dialogButton, 'press', () => {
			let dialog = new Ui.Dialog({
				title: 'Dialog box',
				preferredWidth: 600,
				preferredHeight: 600,
				cancelButton: new Ui.DialogCloseButton()
			});
			let sendButton = new Ui.Button({
				text: 'Send toast',
				verticalAlign: 'center',
				horizontalAlign: 'center'
			});	
			dialog.content = sendButton;
			this.connect(sendButton, 'press', () => Ui.Toast.send('Dialog toast'));
			dialog.open();
		});
		toolbar.append(dialogButton);
	}
}

new App();