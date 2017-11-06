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
		
		let pos1Button = new Ui.Button({ text: 'set true' });
		toolbar.append(pos1Button);
		this.connect(pos1Button, 'press', () => switcher.value = true);
		
		let pos2Button = new Ui.Button({ text: 'set false' });
		toolbar.append(pos2Button);
		this.connect(pos2Button, 'press', () => switcher.value = false);
		
		let enableButton = new Ui.Button({ text: 'enable' });
		toolbar.append(enableButton);
		this.connect(enableButton, 'press', function () {
			switcher.enable();
		});
		
		let disableButton = new Ui.Button({ text: 'disable' });
		toolbar.append(disableButton);
		this.connect(disableButton, 'press', () => switcher.disable());
		
		let vbox2 = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 10 });
		vbox.append(vbox2, true);
		
		switcher = new Ui.Switch({
			verticalAlign: 'center', horizontalAlign: 'center',
			value: true
		});
		
		let label = new Ui.Label({ text: 'Value: ' + switcher.value });
		vbox2.append(label);
		
		vbox2.append(switcher);
		
		this.connect(switcher, 'change', function () {
			label.text = 'Value: ' + switcher.value;
		});
	}
}

new App();
