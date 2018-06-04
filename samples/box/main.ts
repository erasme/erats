/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let greenRect = new Ui.Rectangle();
		let box = new Ui.Box();

		this.content = new Ui.VBox().assign({
			content: [
				new Ui.ToolBar().assign({
					content: [
						new Ui.Button().assign({
							resizable: true,
							text: 'change orientation',
							onpressed: () => {
								if(box.orientation == 'horizontal')
									box.orientation = 'vertical';
								else
									box.orientation = 'horizontal';
							}
						}),
						new Ui.Button().assign({
							text: 'change uniform',
							resizable: true,
							onpressed: () => box.uniform = !box.uniform
						}),
						new Ui.Button().assign({
							text: 'change resizable (green)',
							resizable: true,
							onpressed: () => greenRect.resizable = !greenRect.resizable
						})
					]
				}),
				box.assign({
					resizable: true,
					content: [
						new Ui.Rectangle().assign({ width: 50, height: 50, fill: 'lightblue' }),
						greenRect.assign({ width: 100, height: 100, fill: 'lightgreen' }),
						new Ui.Rectangle().assign({ width: 50, height: 50, fill: 'orange' })
					]
				})
			]
		});
	}
}

new App();
