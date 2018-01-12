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
		
		toolbar.append(new Ui.Button({
			text: 'left',
			onpressed: () => fold.position = 'left'
		}), true);
		
		toolbar.append(new Ui.Button({
			text: 'right',
			onpressed: () => fold.position = 'right'
		}), true);
		
		toolbar.append(new Ui.Button({
			text: 'top',
			onpressed: () => fold.position = 'top'
		}), true);
		
		toolbar.append(new Ui.Button({
			text: 'bottom',
			onpressed: () => fold.position = 'bottom'
		}), true);

		toolbar.append(new Ui.Button({
			text: 'change over',
			onpressed: () => fold.over = !fold.over
		}), true);
		
		toolbar.append(new Ui.Button({
			text: 'change mode',
			onpressed: () => {
				if (fold.mode == 'extend')
					fold.mode = 'slide';
				else
					fold.mode = 'extend';
			}
		}), true);
		
		let lbox = new Ui.LBox({ horizontalAlign: 'center', verticalAlign: 'center' });
		vbox.append(lbox, true);
		
		lbox.append(new Ui.Rectangle({ fill: 'red' }));
		
		let fold: Ui.Fold;
		fold = new Ui.Fold({
			over: true, mode: 'extend', margin: 5,
			background: new Ui.Rectangle({ fill: 'orange' }),
			content: new Ui.Rectangle({ width: 50, height: 50, fill: 'lightgreen', margin: 3 }),
			header: new Ui.Pressable({
				content: new Ui.Rectangle({ width: 50, height: 50, fill: 'lightblue', margin: 3 }),
				onpressed: (e) => fold.invert()
			})
		});
		lbox.append(fold);
		
	}
}

new App();

