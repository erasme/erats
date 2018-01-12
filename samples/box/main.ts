/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let vbox = new Ui.VBox();
		this.content = vbox;
		
		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);
		
		let orientationButton = new Ui.Button({
			text: 'change orientation',
			onpressed: () => {
				if(box.orientation == 'horizontal')
					box.orientation = 'vertical';
				else
					box.orientation = 'horizontal';
			}
		});
		toolbar.append(orientationButton, true);
		
		var uniformButton = new Ui.Button({
			text: 'change uniform',
			onpressed: () => box.uniform = !box.uniform
		});
		toolbar.append(uniformButton, true);

		
		let resizableButton = new Ui.Button({
			text: 'change resizable (green)',
			onpressed: () => {
				if(Ui.Box.getResizable(greenRect))
					Ui.Box.setResizable(greenRect, false);
				else
					Ui.Box.setResizable(greenRect, true);
			}
		});
		toolbar.append(resizableButton, true);
		
		let box = new Ui.Box();
		vbox.append(box, true);
		box.append(new Ui.Rectangle({ width: 50, height: 50, fill: 'lightblue' }));
		let greenRect = new Ui.Rectangle({ width: 100, height: 100, fill: 'lightgreen' });
		box.append(greenRect, false);
		box.append(new Ui.Rectangle({ width: 50, height: 50, fill: 'orange' }));
	}
}

new App();
