/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
		let vbox = new Ui.VBox();
		this.setContent(vbox);

		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);

        let checkbox = new Ui.CheckBox();
        checkbox.text = 'check me'; checkbox.width = 200;
        checkbox.verticalAlign = Ui.VerticalAlign.center;
        checkbox.horizontalAlign = Ui.HorizontalAlign.center;
		vbox.append(checkbox, true);

        let button = new Ui.Button();
        button.setText('check');
		toolbar.append(button);
		this.connect(button, 'press', function() {
			checkbox.value = true;
		});

        button = new Ui.Button();
        button.setText('uncheck');
		toolbar.append(button);
		this.connect(button, 'press', function() {
			checkbox.value = false;
		});

        button = new Ui.Button();
        button.setText('enable');
		toolbar.append(button);
		this.connect(button, 'press', function() {
			checkbox.enable();
		});

        button = new Ui.Button();
        button.setText('disable');
		toolbar.append(button);
		this.connect(button, 'press', function() {
			checkbox.disable();
		});
	}
}

new App();