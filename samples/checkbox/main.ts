/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
		let vbox = new Ui.VBox();
		this.content = vbox;

		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);

		let checkbox = new Ui.CheckBox({
			verticalAlign: 'center', horizontalAlign: 'center',
			width: 200, text: 'check me'
		});
		vbox.append(checkbox, true);

		let button = new Ui.Button({ text: 'check' });
		toolbar.append(button);
		this.connect(button, 'press', function() {
			checkbox.value = true;
		});

		button = new Ui.Button({ text: 'uncheck' });
		toolbar.append(button);
		this.connect(button, 'press', function() {
			checkbox.value = false;
		});

		button = new Ui.Button({ text: 'enable' });
		toolbar.append(button);
		this.connect(button, 'press', function() {
			checkbox.enable();
		});

		button = new Ui.Button({ text: 'disable' });
		toolbar.append(button);
		this.connect(button, 'press', function() {
			checkbox.disable();
		});
	}
}

new App();