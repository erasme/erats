/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Button, the normal looking button
//

class App extends Ui.App {
	constructor() {
		super();
		this.content = new Ui.Button({
			text: 'hello world',
			verticalAlign: 'center', horizontalAlign: 'center',
			onpressed: () => console.log('button pressed')
		});
	}
}

new App();
