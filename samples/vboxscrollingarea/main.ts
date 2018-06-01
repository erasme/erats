/// <reference path="../../era/era.d.ts" />

class TestScrollLoader extends Ui.ScrollLoader {

	signalChange() {
		this.changed.fire({ target: this });
	}

	getMin() {
		return 0;
	}

	getMax() {
		return 200;
	}

	getElementAt(position: number) {
		let item = new Ui.LBox({ marginBottom: 10 });
		let text = 'item '+position;
		let color;
		if(position % 4 === 0) {
			color = '#f0a0f0';
			text = 'this item is a very long text to handle this special case. So a lot a text is needed here';
		}
		else if(position % 4 === 1)
			color = 'lightgreen';
		else if(position % 4 === 2)
			color = 'pink';
		else if(position % 4 === 3)
			color = 'lightblue';
		
		if(position % 4 === 2) {
			item.append(new Ui.Button().assign({ text: text }));
		}
		else {
			item.append(new Ui.Rectangle().assign({ fill: color }));
			item.append(new Ui.Text().assign({ text: text, margin: 10*(position%4), textAlign: 'center' }));
		}
		return item;
	}
}

class TestScrollLoader2 extends Ui.ScrollLoader {

	signalChange() {
		this.changed.fire({ target: this });
	}

    getMin() {
		return 0;
	}

	getMax() {
		return 2;
	}

	getElementAt(position: number) {
		return new Ui.Image().assign({ src: 'building.png', height: 700, width: 400, marginBottom: 10 });
	}
}


class App extends Ui.App {
    constructor() {
		super();
		
		let loader = new TestScrollLoader();

		this.content = new Ui.VBox().assign({
			content: [
				new Ui.Button().assign({
					text: 'Reload',
					onpressed: e => loader.signalChange()
				 }),
				 new Ui.LBox().assign({
					margin: 40, resizable: true,
					content: [
						new Ui.Frame().assign({ frameWidth: 2, fill: '#444' }),
						new Ui.VBoxScrollingArea().assign({
							margin: 2, maxScale: 2, loader: loader
						})
					]	
				})
			]
		});
	}
}

new App();
