/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Fold
//

class App extends Ui.App {
	constructor() {
		super();

		let vbox = new Ui.VBox();
		this.content = vbox;
		
		let toolbar = new Ui.ToolBar();
		vbox.append(toolbar);
		
		let leftButton = new Ui.Button({ text: 'left' });
		toolbar.append(leftButton, true);
		this.connect(leftButton, 'press', () => fold.position = 'left');
		
		let rightButton = new Ui.Button({ text: 'right' });
		toolbar.append(rightButton, true);
		this.connect(rightButton, 'press', () => fold.position = 'right');
		
		let topButton = new Ui.Button({ text: 'top' });
		toolbar.append(topButton, true);
		this.connect(topButton, 'press', () => fold.position = 'top');
		
		let bottomButton = new Ui.Button({ text: 'bottom' });
		toolbar.append(bottomButton, true);
		this.connect(bottomButton, 'press', () => fold.position = 'bottom');
		
		let overButton = new Ui.Button({ text: 'change over' });
		toolbar.append(overButton, true);
		this.connect(overButton, 'press', () => fold.over = !fold.over);
		
		let modeButton = new Ui.Button({ text: 'change mode' });
		toolbar.append(modeButton, true);
		this.connect(modeButton, 'press', () => {
			if (fold.mode == 'extend')
				fold.mode = 'slide';
			else
				fold.mode = 'extend';
		});
		
		let lbox = new Ui.LBox({ horizontalAlign: 'center', verticalAlign: 'center' });
		vbox.append(lbox, true);
		
		lbox.append(new Ui.Rectangle({ fill: 'red' }));
		
		let fold = new Ui.Fold({ over: true, mode: 'extend', margin: 5 });
		lbox.append(fold);
		fold.background = new Ui.Rectangle({ fill: 'orange' });
		let header = new Ui.Pressable();
		header.content = new Ui.Rectangle({ width: 50, height: 50, fill: 'lightblue', margin: 3 });
		header.connect(header, 'press', () => fold.invert());
		fold.header = header;
		fold.content = new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen', margin: 3 });
	}
}

new App();

