/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let el: Ui.Element;

		let hbox = new Ui.HBox();
		this.setContent(hbox);

		let button = new Ui.Button({
			text: 'click for scroll',
			verticalAlign: 'center',
			horizontalAlign: 'center'
		});
		this.connect(button, 'press', () => el.scrollIntoView());
		hbox.append(button, true);

		let scroll = new Ui.ScrollingArea();
		hbox.append(scroll, true);

		let vbox = new Ui.VBox();
		scroll.content = vbox;

		vbox.append(new Ui.Rectangle({ fill: 'orange', height: 400 }));
		vbox.append(new Ui.Rectangle({ fill: 'lightgreen', height: 400 }));
		vbox.append(new Ui.Rectangle({ fill: 'purple', height: 400 }));

		el = new Ui.Rectangle({ fill: 'red', width: 50, height: 50, margin: 50 });
		vbox.append(el);

		vbox.append(new Ui.Rectangle({ fill: 'lightblue', height: 400 }));
		vbox.append(new Ui.Rectangle({ fill: 'pink', height: 400 }));
	}
}

new App();

