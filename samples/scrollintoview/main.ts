/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();
		let el = new Ui.Rectangle();
		this.content = new Ui.HBox().assign({
			content: [
				new Ui.Button().assign({
					text: 'click for scroll',
					verticalAlign: 'center',
					horizontalAlign: 'center',
					resizable: true,
					onpressed: () => el.scrollIntoView()
				}),
				new Ui.ScrollingArea().assign({
					resizable: true,
					content: new Ui.VBox().assign({
						content: [
							new Ui.Rectangle().assign({ fill: 'orange', height: 400 }),
							new Ui.Rectangle().assign({ fill: 'lightgreen', height: 400 }),
							new Ui.Rectangle().assign({ fill: 'purple', height: 400 }),
							el.assign({ fill: 'red', width: 50, height: 50, margin: 50 }),
							new Ui.Rectangle().assign({ fill: 'lightblue', height: 400 }),
							new Ui.Rectangle().assign({ fill: 'pink', height: 400 })
						]
					})
				})
			]
		});
	}
}

new App();

