/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();
		this.drawing.addEventListener('pointerdown', (event) => {
			console.log('pointerdown at: '+event.clientX+','+event.clientY+' found: '+
				Ui.App.current.elementFromPoint(new Ui.Point(event.clientX, event.clientY)));
			Ui.Toast.send(`${Ui.App.current.elementFromPoint(new Ui.Point(event.clientX, event.clientY))}`);
		}, true);

		let vbox = new Ui.VBox({ spacing: 10, margin: 10 });
		this.content = vbox;

		vbox.append(new Ui.Button({ text: 'Click me', icon: 'star' }));

		vbox.append(new Ui.Rectangle({ fill: 'purple', height: 100 }));

		vbox.append(new Ui.Text({ text: 'Some text sample' }));
	}
}

new App();
