/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Button, the normal looking button
//

class App extends Ui.App {
	constructor() {
		super();
		var button = new Ui.Button({ text: 'hello world', verticalAlign: 'center', horizontalAlign: 'center' });
		this.content = button;
		this.connect(button, 'press', () => {
			console.log('button pressed');
//			Ui.Toast.send('button pressed');
		});
	}
}

new App();
