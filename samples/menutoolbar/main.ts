/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Button, the normal looking button
//

class App extends Ui.App {
	constructor() {
		super();
		let vbox = new Ui.VBox();
		this.content = vbox;

		let toolbar = new Ui.MenuToolBar({ spacing: 5, margin: 5 });
		vbox.append(toolbar);

		toolbar.append(new Ui.Button({ text: 'Button1' }));
		toolbar.append(new Ui.Button({ text: 'Button2' }));
		toolbar.append(new Ui.Button({ text: 'Button3' }));
		toolbar.append(new Ui.CompactLabel({ text: 'Test Title resizable', width: 150, fontSize: 22, maxLine: 2, verticalAlign: 'center' }), true);
		toolbar.append(new Ui.Button({ icon: 'plus' }));
		toolbar.append(new Ui.Button({ icon: 'trash' }));
		toolbar.append(new Ui.Button({
			icon: 'edit',
			onpressed: () => {
				var dialog = new Ui.Dialog({ title: 'Edit dialog', preferredWidth: 300, content: new Ui.Text({ text: 'Hello World !' }) });
				dialog.cancelButton = new Ui.Button({ text: 'Close' });
				dialog.open();
			}
		}));

		toolbar.append(new Ui.Button({ icon: 'exit' }));

		vbox.append(new Ui.Button({
			text: 'Prepend button', verticalAlign: 'center', horizontalAlign: 'center',
			onpressed: () => toolbar.prepend(new Ui.Button({ text: 'ButtonX' }))
		}), true);
	}
}

new App();

