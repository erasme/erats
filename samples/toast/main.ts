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

		toolbar.append(new Ui.Button({
			text: 'Send toast',
			onpressed: () => Ui.Toast.send(textfield.value)
		}));

		toolbar.append(new Ui.Button({
			text: 'Send delayed toast',
			onpressed: () => new Core.DelayedTask(2, () => Ui.Toast.send(textfield.value+' DELAY'))
		}));

		toolbar.append(new Ui.Button({
			text: 'Open dialog',
			onpressed: () => {
				let dialog = new Ui.Dialog({
					title: 'Dialog box',
					preferredWidth: 600,
					preferredHeight: 600,
					cancelButton: new Ui.DialogCloseButton()
				});
				dialog.content = new Ui.Button({
					text: 'Send toast',
					verticalAlign: 'center',
					horizontalAlign: 'center',
					onpressed: () => Ui.Toast.send('Dialog toast')
				});
				dialog.open();
			}
		}));
	}
}

new App();