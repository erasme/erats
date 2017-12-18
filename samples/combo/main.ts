/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {

	constructor() {
        super();
		let vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center' });
		this.content = vbox;

        interface MyData { text: string; id: number; }

		let data = [];
		for(let i = 0; i < 25; i++)
			data.push(<MyData>{ text: 'item '+i, id: i });

        let combo = new Ui.Combo({ field: 'text', data: data, placeHolder: 'choice...', search: true });        
		vbox.append(combo);

		this.connect(combo, 'change', function(combo: Ui.Combo, val: MyData, position: number) {
			console.log('Combo change: '+val.text);
			Ui.Toast.send(val.text);
		});
	}
}

new App();
