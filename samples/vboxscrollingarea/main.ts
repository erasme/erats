/// <reference path="../../era/era.d.ts" />

class TestScrollLoader extends Ui.ScrollLoader {

	signalChange() {
		this.fireEvent('change', this);
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
			item.append(new Ui.Button({ text: text }));
		}
		else {
			item.append(new Ui.Rectangle({ fill: color }));
			item.append(new Ui.Text({ text: text, margin: 10*(position%4), textAlign: 'center' }));
		}
		return item;
	}
}

class TestScrollLoader2 extends Ui.ScrollLoader {

	signalChange() {
		this.fireEvent('change', this);
	}

    getMin() {
		return 0;
	}

	getMax() {
		return 2;
	}

	getElementAt(position: number) {
		return new Ui.Image({ src: 'building.png', height: 700, width: 400, marginBottom: 10 });
	}
}


class App extends Ui.App {
    constructor() {
        super();
		let vbox = new Ui.VBox();
		this.content = vbox;

		let button = new Ui.Button({ text: 'Reload' });
		vbox.append(button);
		
		let lbox = new Ui.LBox({ margin: 40 });
		vbox.append(lbox, true);

		lbox.append(new Ui.Frame({ frameWidth: 2, fill: '#444' }));

		let loader = new TestScrollLoader();

        let scroll = new Ui.VBoxScrollingArea({ margin: 2, maxScale: 2, loader: loader });
		lbox.append(scroll);

		this.connect(button, 'press', function() {
			loader.signalChange();
		});
	}
}

new App();
