/// <reference path="../../era/era.d.ts" />

class App extends Ui.App {
    constructor() {
        super();
        let vbox = new Ui.VBox({ verticalAlign: 'center', horizontalAlign: 'center', spacing: 5 });
		this.setContent(vbox);

		let count = 0;
		let activateCount = 0;

        let label = new Ui.Label({ text: 'press count: 0' });
        vbox.append(label);

        let label2 = new Ui.Label({ text: 'activate count: 0' });
		vbox.append(label2);

		let pressable = new Ui.Pressable();
		vbox.append(pressable);

        let rectangle = new Ui.Rectangle({
            width: 100, height: 100, fill: 'lightblue', horizontalAlign: 'center'
        });
		
		pressable.append(rectangle);
		this.connect(pressable, 'press', () => label.text = `press count: ${++count}`);
		this.connect(pressable, 'activate', () => label2.text = `activate count: ${++activateCount}`);
		this.connect(pressable, 'down', () => rectangle.fill = 'blue');
		this.connect(pressable, 'up', () => rectangle.fill = 'lightblue');
	}	
}

new App();

