/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let textfield = new Ui.TextField().assign({
			verticalAlign: 'center', margin: 40, value: 'Hello World !'
		});

		this.content = new Ui.VBox().assign({
			content: [
				new Ui.ToolBar().assign({
					content: [
						new Ui.Button().assign({
							text: 'Send toast',
							onpressed: () => Ui.Toast.send(textfield.value)
						}),
						new Ui.Button().assign({
							text: 'Send delayed toast',
							onpressed: () => new Core.DelayedTask(2, () => Ui.Toast.send(textfield.value + ' DELAY'))
						}),
						new Ui.Button().assign({
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
						})
					]
				}),
				textfield
			]
		});
	}
}

new App();