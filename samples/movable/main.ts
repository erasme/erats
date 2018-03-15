/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
	constructor() {
		super();
		
		let fixed = new Ui.Fixed();
		this.content = fixed;

		fixed.append(new Ui.Movable({
			inertia: true,
			content: new Ui.LBox({
				content: [
					new Ui.Rectangle({ width: 100, height: 100, fill: 'orange', radius: 8 }),
					new Ui.Label({ text: 'free move' })
				]
			})
		}), 0, 0);

		fixed.append(new Ui.Movable({
			moveVertical: false, inertia: true,
			content: new Ui.LBox({
				content: [
					new Ui.Rectangle({ width: 100, height: 100, fill: 'purple', radius: 8 }),
					new Ui.Label({ text: 'horizontal' })
				]
			})
		}), 0, 200);

		fixed.append(new Ui.Movable({
			moveHorizontal: false,
			content: new Ui.LBox({
				content: [
					new Ui.Rectangle({ width: 100, height: 100, fill: 'lightblue', radius: 8 }),
					new Ui.Label({ text: 'vertical' })
				]
			})
		}), 250, 0);

		fixed.append(new Ui.Movable({
			moveVertical: false,
			onmoved: e => {
				let m = e.target;
				if (m.positionX < 0)
					m.setPosition(0, undefined);
				else if (m.positionX > 100)
					m.setPosition(100, undefined);
			},
			content: new Ui.LBox({
				content: [
					new Ui.Rectangle({ width: 200, height: 100, fill: 'lightgreen', radius: 8 }),
					new Ui.Label({ text: 'horizontal limited 0-100' })
				]
			})
		}), 0, 400);
	}
}

new App();
