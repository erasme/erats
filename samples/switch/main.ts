/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Switch
//

class App extends Ui.App {
	constructor() {
		super();
		let switcher: Ui.Switch;
		
		let vbox = new Ui.VBox();
		this.content = vbox;
		
		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);
		
		toolbar.append(new Ui.Button({
			text: 'set true',
			onpressed: () => switcher.value = true
		}));
		
		toolbar.append(new Ui.Button({
			text: 'set false',
			onpressed: () => switcher.value = false
		}));

		toolbar.append(new Ui.Button({
			text: 'enable',
			onpressed: () => switcher.enable()
		}));
		
		toolbar.append(new Ui.Button({
			text: 'disable',
			onpressed: () => switcher.disable()
		}));
		
		let vbox2 = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 10 });
		vbox.append(vbox2, true);
		
		switcher = new Ui.Switch({
			verticalAlign: 'center', horizontalAlign: 'center',
			value: true,
			onchanged: () => label.text = `Value: ${switcher.value}`
		});
		
		let label = new Ui.Label({ text: `Value: ${switcher.value}` });
		vbox2.append(label);
		
		vbox2.append(switcher);
		
		
	}
}

new App();
