/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();

		let overable = new Ui.Overable();
		overable.verticalAlign = Ui.VerticalAlign.center;
		overable.horizontalAlign = Ui.HorizontalAlign.center;
		this.setContent(overable);

		this.connect(overable, 'enter', function () {
			console.log('enter');
			label.show();
		});
		this.connect(overable, 'leave', function () {
			console.log('leave');
			label.hide();
		});

		let lbox = new Ui.LBox();
		lbox.width = 400; lbox.height = 400;
		overable.append(lbox);

		let r1 = new Ui.Rectangle(); r1.fill = 'lightgreen';
		lbox.append(r1);
		let r2 = new Ui.Rectangle(); r2.fill = 'purple'; r2.margin = 50;
		lbox.append(r2);
		let r3 = new Ui.Rectangle(); r3.fill = 'orange'; r3.margin = 100;
		lbox.append(r3);

		let label = new Ui.Label();
		label.verticalAlign = Ui.VerticalAlign.center;
		label.horizontalAlign = Ui.HorizontalAlign.center;
		label.text = 'is over'; label.fontWeight = 'bold'; label.fontSize = 20;
		label.hide();
		lbox.append(label);
	}
}

new App();