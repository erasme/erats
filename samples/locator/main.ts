/// <reference path="../../era/era.d.ts" />

//
// Play with Ui.Button, the normal looking button
//

class App extends Ui.App {
	constructor() {
		super();

		let locator = new Ui.Locator({
			path: '/Fun/Apps/Here/There/Everywhere',
			verticalAlign: 'center', horizontalAlign: 'center'
		});
		this.content = locator;

		this.connect(locator, 'change', (locator: Ui.Locator, path: string) => {
			console.log('path change: '+path);
			Ui.Toast.send('path change: '+path);
		});
	}
}

new App();
