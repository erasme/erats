/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {

	private group = new Ui.RadioGroup().assign({ onchanged: (e) => console.log(e.target) });

    constructor() {
        super();
		let vbox = new Ui.VBox();
		let radiovbox = new Ui.VBox().assign({
			verticalAlign: 'center', horizontalAlign: 'center',
			width: 200, resizable: true
		});
		this.content = vbox;

		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);
		vbox.append(radiovbox);

		let radio = new Ui.RadioBox({
			text: 'this is a radio button'
		});
		radiovbox.append(radio);

		let radio2 = new Ui.RadioBox({
			text: 'this is another radio button'
		});
		radiovbox.append(radio2);

		this.group.add(radio);
		this.group.add(radio2);

		let button = new Ui.Button({
			text: 'check',
			onpressed: () => this.group.current = radio
		});
		toolbar.append(button);

		button = new Ui.Button({
			text: 'uncheck',
			onpressed: () => this.group.current = undefined
		});
		toolbar.append(button);

		button = new Ui.Button({
			text: 'enable',
			onpressed: () => radiovbox.enable()
		});
		toolbar.append(button);

		button = new Ui.Button({
			text: 'disable',
			onpressed: () => radiovbox.disable()
		});
		toolbar.append(button);

		button = new Ui.Button({
			text: 'add radio',
			onpressed: () =>  radiovbox.append(new Ui.RadioBox({ verticalAlign: 'center', horizontalAlign: 'center', width: 200, text: 'created button', group: this.group }))
		});
		toolbar.append(button);

		button = new Ui.Button({
			text: 'remove radio',
			onpressed: () => {
				let children = this.group.children;
				if(children.length > 1) {
					this.group.remove(children[children.length - 1]);
					radiovbox.remove(children[children.length - 1]);
				}
			}
		});
		toolbar.append(button);
	}
}

new App();