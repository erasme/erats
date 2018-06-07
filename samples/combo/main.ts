/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {

	constructor() {
        super();
		let vbox = new Ui.VBox().assign({ verticalAlign: 'center', horizontalAlign: 'center' });
		this.content = vbox;

        interface MyData { text: string; id: number; }

		let data = [];
		for(let i = 0; i < 25; i++)
			data.push(<MyData>{ text: 'item '+i, id: i });

		let combo = new Ui.Combo().assign({
			field: 'text', data: data, placeHolder: 'choice...', search: true
		});
		vbox.append(combo);

		combo.changed.connect(e => {
			console.log('Combo change: ' + (e.value as MyData).text);
			Ui.Toast.send((e.value as MyData).text);
		});
	}
}

new App();
